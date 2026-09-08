// Lighthouse against the *production* build. Needs the preview server
// running (`npm run build && npm run preview` at the root). Writes HTML
// reports to out/ and prints the four category scores.
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertUp, PREVIEW_URL } from "./browser.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, "out");
mkdirSync(OUT, { recursive: true });

await assertUp(PREVIEW_URL);

// Run the CLI's JS entry with this Node directly — no shell, so arguments
// with spaces (the chrome flags) arrive intact on every platform.
const cli = path.join(here, "node_modules", "lighthouse", "cli", "index.js");

for (const mode of ["desktop", "mobile"]) {
  const json = path.join(OUT, `lighthouse-${mode}.json`);
  const html = path.join(OUT, `lighthouse-${mode}.html`);
  const args = [
    cli,
    PREVIEW_URL,
    "--quiet",
    "--chrome-flags=--headless=new --no-sandbox",
    "--only-categories=performance,accessibility,best-practices,seo",
    "--output=json",
    "--output=html",
    `--output-path=${json.replace(/\.json$/, "")}`,
    ...(mode === "desktop" ? ["--preset=desktop"] : []),
  ];
  const r = spawnSync(process.execPath, args, { stdio: "inherit" });

  // Lighthouse writes <path>.report.json / .report.html. The report is
  // the result; judge by it. On Windows, chrome-launcher sometimes fails
  // to delete its temp profile *after* the audit finished (EPERM) and
  // exits 1 with a complete report on disk — that's a warning, not a
  // failure.
  let report;
  try {
    report = JSON.parse(readFileSync(json.replace(/\.json$/, ".report.json"), "utf8"));
  } catch {
    console.error(`lighthouse (${mode}) exited ${r.status} and wrote no report`);
    process.exitCode = 2;
    continue;
  }
  if (r.status !== 0) {
    console.warn(`note: lighthouse (${mode}) exited ${r.status} after writing its report (usually the temp-profile cleanup race on Windows)`);
  }
  const c = report.categories;
  console.log(`\n== Lighthouse ${mode}`);
  for (const k of ["performance", "accessibility", "best-practices", "seo"]) {
    console.log(`  ${k.padEnd(16)} ${Math.round(c[k].score * 100)}`);
  }
  console.log(`  report: ${path.relative(process.cwd(), html.replace(/\.html$/, ".report.html"))}`);
}
