import { createCollectWorker } from "./collect-queue";

console.log("[worker] Starting collect worker...");
const worker = createCollectWorker();

process.on("SIGTERM", async () => {
  console.log("[worker] Shutting down...");
  await worker.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("[worker] Shutting down...");
  await worker.close();
  process.exit(0);
});
