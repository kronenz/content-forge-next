import { createCallerFactory, createTRPCRouter } from "./trpc";
import { sourceRouter } from "./routers/source";
import { pipelineRouter } from "./routers/pipeline";
import { contentRouter } from "./routers/content";
import { reviewRouter } from "./routers/review";
import { publishRouter } from "./routers/publish";
import { analyticsRouter } from "./routers/analytics";

export const appRouter = createTRPCRouter({
  source: sourceRouter,
  pipeline: pipelineRouter,
  content: contentRouter,
  review: reviewRouter,
  publish: publishRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
