// Colors
export const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

export function bold(s: string) { return `${colors.bold}${s}${colors.reset}`; }
export function green(s: string) { return `${colors.green}${s}${colors.reset}`; }
export function red(s: string) { return `${colors.red}${s}${colors.reset}`; }
export function yellow(s: string) { return `${colors.yellow}${s}${colors.reset}`; }
export function blue(s: string) { return `${colors.blue}${s}${colors.reset}`; }
export function cyan(s: string) { return `${colors.cyan}${s}${colors.reset}`; }
export function dim(s: string) { return `${colors.dim}${s}${colors.reset}`; }
export function magenta(s: string) { return `${colors.magenta}${s}${colors.reset}`; }

export function header(title: string) {
  const line = "━".repeat(60);
  console.log(`\n${colors.cyan}${line}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  ${title}${colors.reset}`);
  console.log(`${colors.cyan}${line}${colors.reset}\n`);
}

export function success(msg: string) { console.log(`${green("✓")} ${msg}`); }
export function error(msg: string) { console.error(`${red("✗")} ${msg}`); }
export function warn(msg: string) { console.log(`${yellow("⚠")} ${msg}`); }
export function info(msg: string) { console.log(`${blue("ℹ")} ${msg}`); }

export function stepStart(name: string) {
  process.stdout.write(`${yellow("▶")} ${bold(name)} ... `);
}

export function stepDone(durationMs?: number, extra?: string) {
  const dur = durationMs != null ? ` ${dim(`(${(durationMs / 1000).toFixed(1)}s)`)}` : "";
  const ext = extra ? ` ${dim(extra)}` : "";
  console.log(`${green("done")}${dur}${ext}`);
}

export function stepFail(reason?: string) {
  console.log(`${red("failed")}${reason ? ` - ${reason}` : ""}`);
}

// Simple table output
export function table(headers: string[], rows: string[][]) {
  const widths = headers.map((h, i) => {
    const maxRow = rows.reduce((max, row) => Math.max(max, (row[i] ?? "").length), 0);
    return Math.max(h.length, maxRow);
  });

  const headerLine = headers.map((h, i) => bold(h.padEnd(widths[i]!))).join("  ");
  const separator = widths.map(w => "─".repeat(w)).join("──");

  console.log(headerLine);
  console.log(dim(separator));
  for (const row of rows) {
    console.log(row.map((cell, i) => (cell ?? "").padEnd(widths[i]!)).join("  "));
  }
}

export function divider() {
  console.log(dim("─".repeat(60)));
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateUuid(value: string, label = "ID"): string {
  if (!UUID_RE.test(value)) {
    error(`Invalid ${label}: "${value}" is not a valid UUID`);
    process.exit(1);
  }
  return value;
}
