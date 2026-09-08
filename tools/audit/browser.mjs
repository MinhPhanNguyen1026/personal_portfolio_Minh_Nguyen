// Shared launch: uses the Chrome you already have (Playwright's "chrome"
// channel) so nothing is downloaded. If you don't have Chrome, run
// `npx playwright install chromium` once and set PW_CHANNEL=bundled.
import { chromium } from "playwright";

export const DEV_URL = process.env.PORTFOLIO_URL || "http://localhost:5173/personal_portfolio_Minh_Nguyen/";
export const PREVIEW_URL = process.env.PORTFOLIO_PREVIEW_URL || "http://localhost:4173/personal_portfolio_Minh_Nguyen/";

export async function launch() {
  const channel = process.env.PW_CHANNEL || "chrome";
  return chromium.launch({ headless: true, ...(channel === "bundled" ? {} : { channel }) });
}

export async function assertUp(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(String(r.status));
  } catch {
    console.error(`\nNothing is serving ${url}\nStart it in another terminal first (see docs/RUNNING.md).\n`);
    process.exit(1);
  }
}
