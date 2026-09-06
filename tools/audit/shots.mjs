// Screenshots of the app's main states, desktop and iPhone-sized, written
// to out/shots/. Needs the dev server running (`npm run dev` at the root).
//
//   npm run shots                      all scenarios
//   npm run shots -- login mobile      just those
//   npm run shots -- section=projects  one section, desktop + mobile
import { devices } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { launch, assertUp, DEV_URL } from "./browser.mjs";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "out", "shots");
mkdirSync(OUT, { recursive: true });

const wanted = process.argv.slice(2);
const scenarios = wanted.length ? wanted : ["locked", "typing", "login", "nav", "light", "mobile"];

await assertUp(DEV_URL);
const browser = await launch();
const errors = [];

async function ctx(opts = {}) {
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark", ...opts });
  const page = await c.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push(`[console] ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));
  await page.goto(DEV_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return { c, page };
}

async function shot(page, name) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file });
  console.log(`wrote ${path.relative(process.cwd(), file)}`);
}

async function login(page) {
  await page.getByRole("button", { name: /log in as minh/i }).click();
  await page.getByRole("dialog").waitFor({ state: "detached", timeout: 8000 });
  await page.waitForTimeout(350);
}

const nav = (page, id) => page.getByRole("navigation", { name: /sections/i }).getByRole("button", { name: id, exact: true });

for (const s of scenarios) {
  if (s === "locked") {
    const { c, page } = await ctx();
    await shot(page, "locked");
    await c.close();
  } else if (s === "typing") {
    const { c, page } = await ctx();
    await page.getByRole("button", { name: /log in as minh/i }).click();
    await page.waitForTimeout(450);
    await shot(page, "typing");
    await c.close();
  } else if (s === "login") {
    const { c, page } = await ctx();
    await login(page);
    await page.waitForTimeout(2600); // `juju login` types, then the MOTD prints
    await shot(page, "motd");
    await c.close();
  } else if (s === "nav") {
    const { c, page } = await ctx();
    await login(page);
    await nav(page, "projects").click();
    await page.waitForTimeout(1500);
    await shot(page, "nav-projects");
    await c.close();
  } else if (s === "light") {
    const { c, page } = await ctx({ colorScheme: "light" });
    await login(page);
    await shot(page, "motd-light");
    await c.close();
  } else if (s === "mobile") {
    const { c, page } = await ctx({ ...devices["iPhone 14"], colorScheme: "dark" });
    await shot(page, "mobile-locked");
    await login(page);
    await shot(page, "mobile-motd");
    await nav(page, "experience").click();
    await page.waitForTimeout(1500);
    await shot(page, "mobile-experience");
    await c.close();
  } else if (s === "expanded") {
    // Experience with a row expanded — checks the logo plate and details.
    const { c, page } = await ctx();
    await login(page);
    await nav(page, "experience").click();
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "canonical", exact: true }).click();
    await page.waitForTimeout(400);
    await shot(page, "expanded-canonical");
    const onc = page.getByRole("button", { name: "onc-ai", exact: true });
    await onc.click();
    await page.waitForTimeout(400);
    await onc.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -120)); // clear the fixed status bar
    await page.waitForTimeout(300);
    await shot(page, "expanded-onc-ai");
    await c.close();
  } else if (s === "print") {
    // The page printing as it scrolls: a frame mid-type (output still
    // unwritten), then the same view once it has printed.
    const { c, page } = await ctx();
    await login(page);
    await page.waitForTimeout(1200);
    await page.evaluate(() => document.getElementById("experience").scrollIntoView({ behavior: "auto", block: "start" }));
    await page.waitForTimeout(320);
    await shot(page, "print-1-typing");
    await page.waitForTimeout(1400);
    await shot(page, "print-2-printed");
    // Fast scroll straight to skills: the section must start itself.
    await page.evaluate(() => document.getElementById("skills").scrollIntoView({ behavior: "auto", block: "start" }));
    await page.waitForTimeout(1600);
    await shot(page, "print-3-fast-scroll");
    await c.close();
  } else if (s === "sysinfo") {
    // MOTD printed but the system-information block not yet started,
    // then the block mid-print, then done.
    const { c, page } = await ctx();
    await login(page);
    await page.waitForTimeout(1250);
    await shot(page, "sysinfo-1-motd-only");
    await page.waitForTimeout(650);
    await shot(page, "sysinfo-2-printing");
    await page.waitForTimeout(900);
    await shot(page, "sysinfo-3-done");
    await c.close();
  } else if (s === "bridge") {
    // The bridge between login and experience, printed.
    const { c, page } = await ctx();
    await login(page);
    await page.waitForTimeout(1200);
    await page.evaluate(() => {
      const b = document.querySelector("[data-bridge]");
      window.scrollTo(0, b.getBoundingClientRect().top + window.scrollY - 160);
    });
    await page.waitForTimeout(2200);
    await shot(page, "bridge");
    await c.close();
  } else if (s === "reverse") {
    // Print projects, scroll back up to experience: projects must unwrite.
    const { c, page } = await ctx();
    await login(page);
    await page.evaluate(() => document.getElementById("projects").scrollIntoView({ behavior: "auto", block: "start" }));
    await page.waitForTimeout(2200);
    const printedBefore = await page.evaluate(() => document.querySelectorAll("#projects [data-printed]").length);
    await page.evaluate(() => document.getElementById("experience").scrollIntoView({ behavior: "auto", block: "start" }));
    await page.waitForTimeout(800);
    const printedAfter = await page.evaluate(() => document.querySelectorAll("#projects [data-printed]").length);
    const ready = await page.evaluate(() => document.getElementById("projects").getAttribute("data-ready"));
    console.log(`reverse: projects printed units ${printedBefore} → ${printedAfter}, data-ready=${ready} (want fewer, "false")`);
    if (!(printedAfter < printedBefore && ready === "false")) errors.push("[reverse] projects did not unwrite on scroll-up");
    await c.close();
  } else if (s === "transcript") {
    // Several commands typed in a row — checks entries read as separate.
    const { c, page } = await ctx();
    await login(page);
    const input = page.getByRole("textbox", { name: /command input/i });
    for (const cmd of ["terraform plan -target=module.projects", "juju whoami", "help"]) {
      await input.fill(cmd);
      await input.press("Enter");
      await page.waitForTimeout(700);
    }
    await shot(page, "transcript");
    await c.close();
  } else if (s.startsWith("section=")) {
    const id = s.split("=")[1];
    const { c, page } = await ctx();
    await login(page);
    await nav(page, id).click();
    await page.waitForTimeout(1500);
    await shot(page, `section-${id}`);
    await c.close();
    // Mobile deep link. Note: Chromium's mobile emulation sometimes
    // captures the screenshot offset by the scroll position; the layout
    // itself is fine (measured header top = 0).
    const { c: cm, page: pm } = await ctx({ ...devices["iPhone 14"], colorScheme: "dark" });
    await pm.goto(`${DEV_URL}#${id}`, { waitUntil: "networkidle" });
    await pm.waitForTimeout(500);
    await shot(pm, `section-${id}-mobile`);
    await cm.close();
  } else {
    console.error(`unknown scenario: ${s}`);
  }
}

await browser.close();
if (errors.length) {
  console.log("\nCONSOLE ERRORS:");
  for (const e of errors) console.log("  " + e);
  process.exitCode = 2;
} else {
  console.log("\nno console errors");
}
