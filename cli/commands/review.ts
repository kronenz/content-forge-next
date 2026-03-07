import { db } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { reviews, processedContents } from "@/server/db/schema";
import { generateText } from "ai";
import { getModel } from "@/server/agents/model";
import {
  header, success, error, info, table, divider,
  bold, green, yellow, red, dim, validateUuid,
} from "../lib/output";

export async function reviewCommand(args: string[]) {
  const subCommand = args[0];

  switch (subCommand) {
    case "list":
      await reviewList();
      break;
    case "approve":
      await reviewApprove(args[1]);
      break;
    case "reject":
      await reviewReject(args[1], args);
      break;
    case "auto":
      await reviewAuto(args[1]);
      break;
    default:
      error("Usage: forge review <list|approve|reject|auto> [options]");
      console.log(`\n  ${bold("list")}                           List pending reviews`);
      console.log(`  ${bold("approve")} <reviewId>              Approve a review`);
      console.log(`  ${bold("reject")}  <reviewId> --reason=... Reject a review`);
      console.log(`  ${bold("auto")}    <processedContentId>    Run AI auto-review`);
      process.exit(1);
  }
}

async function reviewList() {
  header("Pending Reviews");

  const pendingReviews = await db.query.reviews.findMany({
    where: eq(reviews.status, "pending"),
    orderBy: [desc(reviews.createdAt)],
    with: { processedContent: true },
  });

  if (pendingReviews.length === 0) {
    info("No pending reviews.");
    return;
  }

  table(
    ["ID", "Content ID", "Platform", "Reviewer", "Created"],
    pendingReviews.map((r) => [
      r.id.slice(0, 8) + "...",
      r.processedContentId.slice(0, 8) + "...",
      (r.processedContent as { platform?: string })?.platform ?? "-",
      r.reviewer,
      r.createdAt.toISOString().slice(0, 19).replace("T", " "),
    ]),
  );

  console.log(`\nTotal: ${pendingReviews.length} pending reviews`);
}

async function reviewApprove(reviewId?: string) {
  if (!reviewId) {
    error("Usage: forge review approve <reviewId>");
    process.exit(1);
  }
  validateUuid(reviewId, "review ID");

  const review = await db.query.reviews.findFirst({
    where: eq(reviews.id, reviewId),
  });

  if (!review) {
    error(`Review not found: ${reviewId}`);
    process.exit(1);
  }

  await db.update(reviews).set({ status: "approved" }).where(eq(reviews.id, reviewId));
  success(`Review ${reviewId.slice(0, 8)}... approved`);
}

async function reviewReject(reviewId?: string, args: string[] = []) {
  if (!reviewId) {
    error("Usage: forge review reject <reviewId> --reason=<reason>");
    process.exit(1);
  }
  validateUuid(reviewId, "review ID");

  const reasonArg = args.find(a => a.startsWith("--reason="));
  const reason = reasonArg?.split("=").slice(1).join("=") ?? "Rejected via CLI";

  const review = await db.query.reviews.findFirst({
    where: eq(reviews.id, reviewId),
  });

  if (!review) {
    error(`Review not found: ${reviewId}`);
    process.exit(1);
  }

  await db.update(reviews).set({
    status: "rejected",
    feedback: reason,
  }).where(eq(reviews.id, reviewId));

  success(`Review ${reviewId.slice(0, 8)}... rejected: ${reason}`);
}

async function reviewAuto(processedContentId?: string) {
  if (!processedContentId) {
    error("Usage: forge review auto <processedContentId>");
    process.exit(1);
  }
  validateUuid(processedContentId, "processed content ID");

  header("AI Auto-Review");

  const content = await db.query.processedContents.findFirst({
    where: eq(processedContents.id, processedContentId),
  });

  if (!content) {
    error(`Processed content not found: ${processedContentId}`);
    process.exit(1);
  }

  info(`Platform: ${bold(content.platform)}`);
  info(`Content: ${(content.title ?? content.body.slice(0, 50) + "...").slice(0, 60)}`);
  console.log("");

  info("Running AI review...");

  const { text, usage } = await generateText({
    model: getModel(),
    system: `You are an expert content quality reviewer. Evaluate the content and provide scores.

You MUST respond with valid JSON:
{
  "qualityScore": 8.5,
  "accuracyScore": 9.0,
  "humanLikeScore": 7.5,
  "platformFitScore": 8.0,
  "cultureFitScore": 7.0,
  "feedback": "Overall assessment and suggestions",
  "status": "approved" or "revision"
}

Scoring rules:
- Each score is 0-10 with one decimal place
- "approved" if all scores >= 7.0
- "revision" if any score < 7.0
- Provide specific, actionable feedback`,
    prompt: `Review the following ${content.platform} content:

Title: ${content.title ?? "(no title)"}

Body:
${content.body}

Metadata: ${JSON.stringify(content.metadata ?? {})}

Respond with JSON only.`,
  });

  let result: {
    qualityScore: number;
    accuracyScore: number;
    humanLikeScore: number;
    platformFitScore: number;
    cultureFitScore: number;
    feedback: string;
    status: "approved" | "revision";
  };

  try {
    result = JSON.parse(text);
  } catch {
    error(`AI returned invalid JSON. Raw response:\n${dim(text.slice(0, 500))}`);
    process.exit(1);
  }

  // Insert review record
  await db.insert(reviews).values({
    processedContentId,
    pipelineRunId: content.pipelineRunId,
    reviewer: "auto",
    status: result.status,
    qualityScore: result.qualityScore,
    accuracyScore: result.accuracyScore,
    humanLikeScore: result.humanLikeScore,
    platformFitScore: result.platformFitScore,
    cultureFitScore: result.cultureFitScore,
    feedback: result.feedback,
  });

  divider();
  console.log(`\n  ${bold("Quality Scores:")}`);

  const scoreColor = (score: number) => score >= 8 ? green : score >= 7 ? yellow : red;
  console.log(`    Quality:       ${scoreColor(result.qualityScore)(result.qualityScore.toFixed(1))}/10`);
  console.log(`    Accuracy:      ${scoreColor(result.accuracyScore)(result.accuracyScore.toFixed(1))}/10`);
  console.log(`    Human-like:    ${scoreColor(result.humanLikeScore)(result.humanLikeScore.toFixed(1))}/10`);
  console.log(`    Platform-fit:  ${scoreColor(result.platformFitScore)(result.platformFitScore.toFixed(1))}/10`);
  console.log(`    Culture-fit:   ${scoreColor(result.cultureFitScore)(result.cultureFitScore.toFixed(1))}/10`);

  console.log(`\n  ${bold("Status:")} ${result.status === "approved" ? green("APPROVED") : yellow("NEEDS REVISION")}`);
  console.log(`  ${bold("Feedback:")} ${result.feedback}`);
  console.log(`  ${dim(`Tokens: ${(usage.inputTokens ?? 0) + (usage.outputTokens ?? 0)}`)}`);
  console.log("");
}
