import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { subscriptions } from "@/server/db/schema";
import {
  constructWebhookEvent,
  extractPlanFromSubscription,
} from "@/server/billing";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(body, signature);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId || !session.subscription || !session.customer) break;

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id;
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer.id;

      // Upsert subscription record
      const existing = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(subscriptions)
          .set({
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            status: "active",
          })
          .where(eq(subscriptions.userId, userId));
      } else {
        await db.insert(subscriptions).values({
          userId,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          planId: "creator", // Will be updated by subscription.updated
          status: "active",
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (!userId) break;

      const planId = extractPlanFromSubscription(subscription) ?? "free";
      const item = subscription.items.data[0];

      const sub = subscription as Stripe.Subscription & {
        current_period_start?: number;
        current_period_end?: number;
      };

      await db
        .update(subscriptions)
        .set({
          planId,
          stripePriceId: item?.price.id ?? null,
          status: mapStripeStatus(subscription.status),
          currentPeriodStart: sub.current_period_start
            ? new Date(sub.current_period_start * 1000)
            : null,
          currentPeriodEnd: sub.current_period_end
            ? new Date(sub.current_period_end * 1000)
            : null,
          cancelAtPeriodEnd: subscription.cancel_at_period_end ? 1 : 0,
        })
        .where(eq(subscriptions.userId, userId));
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (!userId) break;

      await db
        .update(subscriptions)
        .set({
          planId: "free",
          status: "canceled",
          cancelAtPeriodEnd: 0,
        })
        .where(eq(subscriptions.userId, userId));
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice & {
        subscription?: string | { id: string } | null;
      };
      const subscriptionId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id;
      if (!subscriptionId) break;

      await db
        .update(subscriptions)
        .set({ status: "past_due" })
        .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));
      break;
    }
  }

  return NextResponse.json({ received: true });
}

function mapStripeStatus(
  status: Stripe.Subscription.Status,
): "active" | "canceled" | "past_due" | "trialing" | "incomplete" {
  switch (status) {
    case "active":
      return "active";
    case "canceled":
    case "unpaid":
      return "canceled";
    case "past_due":
      return "past_due";
    case "trialing":
      return "trialing";
    default:
      return "incomplete";
  }
}
