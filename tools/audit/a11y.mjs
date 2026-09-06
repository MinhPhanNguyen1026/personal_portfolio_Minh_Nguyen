// Accessibility audit: axe-core across the app's states, a keyboard tab
// walk, and a reduced-motion check. Needs the dev server running
// (`npm run dev` at the root). Exit code 2 if anything fails.
import { devices } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { launch, assertUp, DEV_URL } from "./browser.mjs";

await assertUp(DEV_URL);
const browser = await launch();
let total = 0;

async function axe(page, label) {
  const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze();
  const v = res.violations;
  total += v.length;
  console.log(`\n== ${label}: ${v.length} violation(s), ${res.passes.length} passes`);
  for (const x of v) {
    console.log(`  [${x.impact}] ${x.id}: ${x.help}`);
    for (const n of x.nodes.slice(0, 3)) console.log(`     - ${n.target.join(" ")}  ${n.failureSummary?.split("\n")[1]?.trim() ?? ""}`);
  }
}

async function open(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark", ...opts });
  const page = await ctx.newPage();
  await page.goto(DEV_URL, { waitUntil: "networkidle" });
  return { ctx, page };
}

async function skipLogin(page) {
  await page.getByRole("button", { name: /skip/i }).click();
  await page.waitForTimeout(450); // let the MOTD un-blur finish before sampling colours
}

{
  const { ctx, page } = await open();
  await axe(page, "locked / dark / desktop");
  await ctx.close();
}
{
  const { ctx, page } = await open();
  await skipLogin(page);
  await page.getByRole("button", { name: "onc-ai", exact: true }).click();
  await page.getByRole("button", { name: /^React/ }).first().click();
  await axe(page, "open + row + job expanded / dark / desktop");
  await ctx.close();
}
{
  const { ctx, page } = await open({ colorScheme: "light" });
  await skipLogin(page);
  await axe(page, "open / light / desktop");
  await ctx.close();
}
{
  const { ctx, page } = await open({ ...devices["iPhone 14"], colorScheme: "dark" });
  await skipLogin(page);
  await page.getByRole("button", { name: /expand terminal/i }).click();
  await axe(page, "open + drawer / dark / mobile");
  await ctx.close();
}
{
  const { ctx, page } = await open({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: /log in as minh/i }).click();
  const authenticating = await page.getByRole("button", { name: /authenticating/i }).count();
  const dialog = await page.getByRole("dialog").count();
  console.log(`\n== reduced motion: authenticating=${authenticating} dialog=${dialog} (want 0, 0)`);
  if (authenticating || dialog) total += 1;
  await ctx.close();
}
{
  const { ctx, page } = await open();
  const stops = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    stops.push(
      await page.evaluate(() => {
        const el = document.activeElement;
        const name = el.getAttribute("aria-label") || el.textContent.trim().replace(/\s+/g, " ").slice(0, 40);
        return `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""} "${name}"`;
      })
    );
  }
  console.log("\n== tab order (locked):");
  stops.forEach((s, i) => console.log(`  ${String(i + 1).padStart(2)}. ${s}`));
  await ctx.close();
}

await browser.close();
console.log(`\nTOTAL violations: ${total}`);
process.exitCode = total ? 2 : 0;
