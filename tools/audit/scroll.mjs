// Scroll ↔ URL sync and command navigation. Needs the dev server running.
// Checks the things that went wrong once: the readout at the top, the
// bottom, mid-section, and that a navigating command always lands at the
// section's top — even when that section is already "current".
import { launch, assertUp, DEV_URL } from "./browser.mjs";

await assertUp(DEV_URL);
const browser = await launch();
// Reduced motion → instant scrolls, so positions can be asserted exactly.
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark", reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(DEV_URL, { waitUntil: "networkidle" });
await page.keyboard.press("Escape"); // past the login card
await page.waitForTimeout(300);

let failures = 0;
function check(label, ok, detail) {
  console.log(`${ok ? " ok " : "FAIL"} ${label}${detail ? `   (${detail})` : ""}`);
  if (!ok) failures += 1;
}

const state = () =>
  page.evaluate(() => ({
    y: Math.round(window.scrollY),
    hash: location.hash,
    current: document.querySelector('nav[aria-label="Sections"] [aria-current="true"]')?.textContent.trim() ?? null,
    tops: Object.fromEntries(
      [...document.querySelectorAll("main section[id]")].map((s) => [s.id, Math.round(s.getBoundingClientRect().top + window.scrollY)])
    ),
  }));

async function scrollTo(y) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(250);
}

const STATUSBAR = 40;
const nearTop = (s, id) => Math.abs(s.y - (s.tops[id] - STATUSBAR)) <= 4;

let s = await state();

await scrollTo(s.tops.experience + 600);
s = await state();
check("mid-experience → readout experience, hash #experience", s.current === "experience" && s.hash === "#experience", `${s.current} ${s.hash}`);

await scrollTo(0);
s = await state();
check("top → readout login, hash cleared", s.current === "login" && s.hash === "", `${s.current} "${s.hash}"`);

await scrollTo(s.tops.experience - 500);
s = await state();
check("between login and experience → readout login", s.current === "login", s.current);

await page.getByRole("button", { name: 'Run "juju status --model experience"' }).click();
await page.waitForTimeout(500);
s = await state();
check("run `juju status --model experience` from between → lands at experience top", nearTop(s, "experience") && s.current === "experience", `y=${s.y} top=${s.tops.experience}`);

// Keep the probe line (35% down the viewport) inside the section.
await scrollTo(s.tops.experience + 300);
s = await state();
check("mid-experience again → readout experience", s.current === "experience", s.current);
await page.getByRole("navigation", { name: /sections/i }).getByRole("button", { name: "experience", exact: true }).click();
await page.waitForTimeout(500);
s = await state();
check("`juju switch experience` while already in experience → scrolls to its top", nearTop(s, "experience"), `y=${s.y} top=${s.tops.experience}`);

await scrollTo(1e9);
s = await state();
check("bottom → readout transcript, hash #transcript", s.current === "transcript" && s.hash === "#transcript", `${s.current} ${s.hash}`);

// A non-navigating command brings the end of the transcript into view.
await scrollTo(0);
const prompt = page.getByRole("textbox", { name: /command input/i });
await prompt.fill("help");
await prompt.press("Enter");
await page.waitForTimeout(600);
s = await state();
const atBottom = await page.evaluate(() => Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 4);
check("`help` from the top → scrolls to the end of the transcript", atBottom && s.current === "transcript", `y=${s.y} current=${s.current}`);

await scrollTo(0);
s = await state();
check("back to top after everything → login, hash cleared", s.current === "login" && s.hash === "", `${s.current} "${s.hash}"`);

// The top-left minh@portfolio link is Home: top of page, no error, no login replay.
await scrollTo(s.tops.skills + 200);
await page.getByRole("link", { name: "Home" }).click();
await page.waitForTimeout(500);
s = await state();
const homeError = await page.evaluate(() => /not a controller/.test(document.querySelector('[role="log"]')?.textContent ?? ""));
const dialogs = await page.getByRole("dialog").count();
check("Home link → top, hash cleared, no error, no login card", s.y <= 4 && s.hash === "" && !homeError && dialogs === 0, `y=${s.y} hash="${s.hash}" error=${homeError} dialogs=${dialogs}`);

await browser.close();
console.log(failures ? `\n${failures} failure(s)` : "\nall scroll/URL checks pass");
process.exitCode = failures ? 2 : 0;
