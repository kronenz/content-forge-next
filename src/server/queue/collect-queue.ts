import { Queue, Worker, type Job } from "bullmq";
import { getRedisConnectionOpts } from "./connection";
import { collectFromSource } from "@/server/collectors";

const QUEUE_NAME = "collect";

export interface CollectJobData {
  sourceId: string;
  triggeredBy: "schedule" | "manual";
}

export interface CollectJobResult {
  sourceId: string;
  collected: number;
  duplicates: number;
  errors: string[];
  completedAt: string;
}

let queue: Queue<CollectJobData, CollectJobResult> | null = null;

export function getCollectQueue(): Queue<CollectJobData, CollectJobResult> {
  if (!queue) {
    queue = new Queue(QUEUE_NAME, {
      connection: getRedisConnectionOpts(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5_000 },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
      },
    });
  }
  return queue;
}

export async function addCollectJob(
  sourceId: string,
  triggeredBy: "schedule" | "manual" = "manual",
): Promise<string> {
  const q = getCollectQueue();
  const job = await q.add(
    `collect:${sourceId}`,
    { sourceId, triggeredBy },
    { jobId: `collect:${sourceId}:${Date.now()}` },
  );
  return job.id!;
}

export async function registerSchedule(
  sourceId: string,
  schedule: string,
): Promise<void> {
  const q = getCollectQueue();
  // Remove existing repeatable job for this source
  await removeSchedule(sourceId);
  // Add new repeatable job
  await q.add(
    `collect:${sourceId}`,
    { sourceId, triggeredBy: "schedule" },
    {
      repeat: { pattern: schedule },
      jobId: `scheduled:${sourceId}`,
    },
  );
}

export async function removeSchedule(sourceId: string): Promise<void> {
  const q = getCollectQueue();
  const repeatableJobs = await q.getRepeatableJobs();
  for (const job of repeatableJobs) {
    if (job.name === `collect:${sourceId}`) {
      await q.removeRepeatableByKey(job.key);
    }
  }
}

export function createCollectWorker(): Worker<CollectJobData, CollectJobResult> {
  const worker = new Worker<CollectJobData, CollectJobResult>(
    QUEUE_NAME,
    async (job: Job<CollectJobData, CollectJobResult>) => {
      const { sourceId } = job.data;
      const result = await collectFromSource(sourceId);
      return {
        ...result,
        completedAt: new Date().toISOString(),
      };
    },
    {
      connection: getRedisConnectionOpts(),
      concurrency: 5,
    },
  );

  worker.on("completed", (job) => {
    const r = job.returnvalue;
    console.log(
      `[collect] ${job.data.sourceId}: ${r.collected} new, ${r.duplicates} dups`,
    );
  });

  worker.on("failed", (job, err) => {
    console.error(
      `[collect] ${job?.data.sourceId} failed:`,
      err.message,
    );
  });

  return worker;
}
