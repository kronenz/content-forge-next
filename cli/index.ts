#!/usr/bin/env bun

const args = process.argv.slice(2);
const command = args[0];
const subArgs = args.slice(1);

const HELP = `
\x1b[1m\x1b[36mContent Forge CLI\x1b[0m - AI Agent Pipeline Runner

\x1b[1mUsage:\x1b[0m
  forge <command> [options]

\x1b[1mCommands:\x1b[0m
  collect       Collect content from sources
  pipeline      Run AI agent pipeline on content
  flow          Run full flow (collect → pipeline → review)
  review        Manage content reviews
  sources       List registered sources
  contents      List collected raw contents
  status        Show system status

\x1b[1mExamples:\x1b[0m
  forge status
  forge sources
  forge collect --all
  forge collect --source=<uuid>
  forge pipeline run --content=<uuid>
  forge pipeline list
  forge flow --source=<uuid> --auto-approve
  forge review list
  forge review approve <id>
  forge review auto <processedContentId>
  forge contents --limit=50

\x1b[1mOptions:\x1b[0m
  --help, -h    Show this help message
`;

async function main() {
  if (!command || command === "--help" || command === "-h") {
    console.log(HELP);
    process.exit(0);
  }

  try {
    switch (command) {
      case "status": {
        const { statusCommand } = await import("./commands/status");
        await statusCommand();
        break;
      }
      case "sources": {
        const { sourcesCommand } = await import("./commands/sources");
        await sourcesCommand(subArgs);
        break;
      }
      case "contents": {
        const { contentsCommand } = await import("./commands/contents");
        await contentsCommand(subArgs);
        break;
      }
      case "collect": {
        const { collectCommand } = await import("./commands/collect");
        await collectCommand(subArgs);
        break;
      }
      case "pipeline": {
        const { pipelineCommand } = await import("./commands/pipeline");
        await pipelineCommand(subArgs);
        break;
      }
      case "flow": {
        const { flowCommand } = await import("./commands/flow");
        await flowCommand(subArgs);
        break;
      }
      case "review": {
        const { reviewCommand } = await import("./commands/review");
        await reviewCommand(subArgs);
        break;
      }
      default:
        console.error(`Unknown command: ${command}`);
        console.log(HELP);
        process.exit(1);
    }
  } catch (err) {
    console.error(`\x1b[31mFatal error:\x1b[0m ${err instanceof Error ? err.message : String(err)}`);
    if (err instanceof Error && err.stack) {
      console.error(`\x1b[90m${err.stack}\x1b[0m`);
    }
    process.exit(1);
  }

  process.exit(0);
}

main();
