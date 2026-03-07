import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { subscriptions } from "@/server/db/schema";
import { PLANS } from "@/server/services/subscription";
import type { PlanId } from "@/server/services/subscription";
import {
  getStripePriceId,
  createCheckoutSession,
  createCustomerPortalSession,
  getUsageStats,
} from "@/server/billing";

export const billingRouter = createTRPCRouter({
  // Get all plans
  plans: publicProcedure.query(() => {
    return PLANS.map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      yearlyPrice: plan.yearlyPrice,
      limits: plan.limits,
      features: plan.features,
      popular: plan.popular ?? false,
    }));
  }),

  // Get current subscription
  subscription: protectedProcedure.query(async ({ ctx }) => {
    const [sub] = await ctx.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.session.userId))
      .limit(1);

    if (!sub) {
      return {
        planId: "free" as PlanId,
        status: "active" as const,
        cancelAtPeriodEnd: false,
        currentPeriodEnd: null,
        stripeCustomerId: null,
      };
    }

    return {
      planId: sub.planId as PlanId,
      status: sub.status,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd === 1,
      currentPeriodEnd: sub.currentPeriodEnd,
      stripeCustomerId: sub.stripeCustomerId,
    };
  }),

  // Get usage stats
  usage: protectedProcedure.query(async ({ ctx }) => {
    const [sub] = await ctx.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.session.userId))
      .limit(1);

    const planId = (sub?.planId ?? "free") as PlanId;
    return getUsageStats(planId);
  }),

  // Create checkout session
  checkout: protectedProcedure
    .input(
      z.object({
        planId: z.enum(["creator", "pro", "team"]),
        interval: z.enum(["monthly", "yearly"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const priceId = getStripePriceId(input.planId, input.interval);

      if (!priceId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Stripe price not configured for this plan",
        });
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

      const session = await createCheckoutSession({
        userId: ctx.session.userId,
        email: ctx.session.email,
        priceId,
        successUrl: `${appUrl}/settings/billing?success=true`,
        cancelUrl: `${appUrl}/settings/billing?canceled=true`,
      });

      return { url: session.url };
    }),

  // Create customer portal session
  portal: protectedProcedure.mutation(async ({ ctx }) => {
    const [sub] = await ctx.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.session.userId))
      .limit(1);

    if (!sub?.stripeCustomerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active subscription found",
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await createCustomerPortalSession({
      customerId: sub.stripeCustomerId,
      returnUrl: `${appUrl}/settings/billing`,
    });

    return { url: session.url };
  }),
});
