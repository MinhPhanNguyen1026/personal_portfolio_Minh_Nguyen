# Portfolio redesign: the control-plane theme

Branch: `redesign/cli-control-plane`. This document is the working plan; it is
updated as phases land.

## 1. The concept in one paragraph

The portfolio *is* a control plane for Minh. A visitor "logs in" (a scripted
`juju login`, no input required), is greeted by a MOTD that introduces Minh,
and then navigates the site the way an operator navigates infrastructure:
switching between controllers, reading `juju status`, inspecting a Terraform
plan, watching a CI pipeline. Every navigation action is a real command that
gets echoed into a terminal drawer — but nobody is ever forced to type.

Why this works as a showcase: the **subject matter** (Juju, MicroK8s,
Terraform, CI/CD, cloud) proves the platform-engineering half, and the
**execution** (a fast, responsive, accessible, well-structured React app)
proves the web-dev half. Each half of the pitch is demonstrated, not claimed.

## 2. One metaphor, six surfaces

The earlier worry was concept sprawl — Juju + MicroK8s + JAAS + Terraform is a
lot of costumes. The fix is to keep **one spine** (the Juju model:
controller → model → application → relation) and let each requested tool be
the natural *rendering* of one section rather than a competing metaphor.

| Tool         | Where it lives                      | Role                                         |
| ------------ | ----------------------------------- | -------------------------------------------- |
| CLI          | Everywhere — the terminal drawer    | The navigation surface. Click fills; typing works too. |
| JAAS / Juju  | Intro + Experience                  | `juju login` intro; `juju status` for employers; `juju switch` between sections. |
| MicroK8s     | Status bar, ambient                 | The cloud the whole thing "runs on": `cloud: microk8s/localhost`. Not a section. |
| Terraform    | Projects                            | Each project is an HCL `resource` block; the section reads like `terraform plan`. |
| CI/CD        | Skills + the site's own deploy      | Skills as a pipeline of green-check jobs; the status bar shows the *real* last deploy. |
| Cloud        | Tags on experience + status bar     | Provider chips (GCP, Firebase…) on the roles that used them. Ambient. |
| Web dev      | The whole thing                     | The fact that all of this is a clickable, responsive UI is the proof. |

Terraform, not Juju bundles, for projects: Terraform is recognizable to far
more people than Juju, and it covers the "Terraform" ask directly.

## 3. Information architecture

Single scrolling page with a persistent shell. Sections are "controllers";
`juju switch <name>` scrolls to one and updates the URL hash.

```
┌──────────────────────────────────────────────────────────────────────┐
│ minh@portfolio  ▸ controller: experience  ▸ cloud: microk8s  ● a6b1cbd ✓ │  status bar
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [login]      juju login → MOTD hero (name, one-liner, role, links)  │
│  [experience] juju status → table of employers as applications       │
│  [projects]   terraform plan → HCL resource blocks (+ topology SVG)  │
│  [skills]     CI pipeline → stages of green-check jobs               │
│  [contact]    juju expose contact → links                            │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ $ juju switch experience                          ▲ terminal drawer   │
│ Switched to "experience" on controller "minh".      (collapsed on     │
│ $ █                                                  mobile)          │
└──────────────────────────────────────────────────────────────────────┘
```

### Login (hero)

- A JAAS-styled login card. One button: **Log in**. On click, the username
  `minh` and a masked password auto-type, then the card resolves into a MOTD
  banner: name, one-line pitch, current role at Canonical, location, four
  quick links (LinkedIn, GitHub, email, resume).
- The MOTD is the real `<h1>` and the page's primary content; the login card
  is a visual state, not a gate. Content below is always in the DOM.
- **Skip** button and `Esc` both jump straight to the MOTD. With
  `prefers-reduced-motion`, there is no typing animation — the MOTD renders
  immediately.

### Experience → `juju status`

The classic `juju status` layout, rendered faithfully because Canonical
engineers will look at it:

```
Model  Controller  Cloud/Region        Version  Timestamp
minh   experience  microk8s/localhost  3.6.x    now

App               Version  Status   Scale  Charm            Channel  Rev
canonical         2025+    active   1      software-eng     stable   —
interplay-lab     2025+    active   1      research-asst    stable   —
onc-ai            2025     terminated 1    software-eng     —        —
...
```

Semantics: current roles are `active` (green dot), past roles `terminated`
(muted). Each row expands on click/Enter to show the role details, dates, and
cloud/tool chips. On narrow screens the same data renders as stacked cards
(markup is a list styled as a grid on wide screens — keeps semantics intact
for screen readers instead of `display:block`-ing a `<table>`).

### Projects → `terraform plan`

```hcl
# module.projects
+ resource "web_app" "melcourses" {
    name        = "Melcourses CDCS System"
    role        = "Frontend Lead"
    stack       = ["Next.js", "React", "TypeScript", "SQL"]
    users       = "2000+"
    url         = "https://melcourses.com"
  }
```

Each project is a card whose header is a syntax-highlighted HCL block and
whose body is the screenshot + prose. The green `+` and the plan summary
(`Plan: 4 to add, 0 to change, 0 to destroy.`) frame the section. Stretch
goal: a small SVG topology per project (`react ↔ api ↔ postgres` with
relation lines) — the single most distinctive visual available here.

### Skills → CI pipeline

Stages as columns: **languages → frontend → backend → infra & cloud → tooling**.
Each skill is a job with a green check; hovering/focusing shows where it was
used. Horizontal on wide screens, vertical on mobile. This is the
GitHub-Actions-graph aesthetic and it directly satisfies "CI/CD".

### Contact → `juju expose contact`

A short terminal block resolving to the four links. Footer carries the
"Designed and developed by" line and the real build SHA.

## 4. Visual theme: "Ember on Ink"

Dark-first because terminals are dark — but a *clean* dark: deep blue-black,
warm neutral text, and **one** warm accent. No neon green on black. Status
colors exist only for status semantics (active/terminated/warn/error) and are
always paired with a word or glyph, never the sole carrier of meaning.

The accent is a warm ember — same family as Ubuntu orange, deliberately not
the exact brand hex. It's a wink for Canonical people, not a costume.

### Dark — "Ink" (default when the OS prefers dark or no preference)

| Token            | Value      | Use                                   |
| ---------------- | ---------- | ------------------------------------- |
| `--bg-0`         | `#0a0d13`  | Page                                  |
| `--bg-1`         | `#10141c`  | Terminal, panels                      |
| `--bg-2`         | `#171c26`  | Cards, hovered rows                   |
| `--line`         | `#232a37`  | Hairlines                             |
| `--line-strong`  | `#303849`  | Focused/active borders                |
| `--fg-0`         | `#e8ebf0`  | Primary text                          |
| `--fg-1`         | `#a9b1c0`  | Secondary text                        |
| `--fg-2`         | `#7f8a9d`  | Muted, comments, timestamps (4.6:1 on bg-1) |
| `--accent`       | `#ff7a45`  | Ember. Prompt, links, focus ring, `+` |
| `--accent-soft`  | `rgba(255,122,69,.14)` | Accent fills          |
| `--ok`           | `#5cc98a`  | active, ✓                             |
| `--warn`         | `#e3b341`  | waiting, maintenance                  |
| `--err`          | `#f06f6f`  | error, blocked                        |
| `--info`         | `#6cb6ff`  | strings, links in code                |
| `--meta`         | `#b48cff`  | HCL keywords, resource types          |

### Light — "Paper"

A real light mode, not an inversion. Warm paper ground that nods to the old
site's softness.

| Token            | Value      |
| ---------------- | ---------- |
| `--bg-0`         | `#f7f6f3`  |
| `--bg-1`         | `#ffffff`  |
| `--bg-2`         | `#efede8`  |
| `--line`         | `#e2dfd8`  |
| `--line-strong`  | `#c9c5bb`  |
| `--fg-0`         | `#1a1d24`  |
| `--fg-1`         | `#4b5160`  |
| `--fg-2`         | `#626a79`  |
| `--accent`       | `#bf3f10`  |
| `--ok` / `--warn` / `--err` / `--info` / `--meta` | `#167a41` / `#8a5f00` / `#c43d3d` / `#1a64bd` / `#7a4fd6` |

Every text/surface pair — including status colours on every surface they
appear on — was verified ≥ 4.5:1 with axe across the app's states (locked,
open, rows and jobs expanded, light, mobile). The muted and status values
above are the post-audit ones; the first draft's `--fg-2` and light-mode
accent/ok/warn/info were each a shade too light on the raised surfaces.
Theme follows `prefers-color-scheme`, with a toggle in the status bar that
persists to `localStorage`.

### Type

- **Inter** (variable) for prose and headings — the human voice.
- **JetBrains Mono** (variable) for every machine surface: terminal, status
  table, HCL, pipeline labels, eyebrows, the status bar.
- Self-hosted via `@fontsource-variable/*` (font files only, no scripts) so
  there is no third-party font request. `font-display: swap`, latin subset.

Splitting mono/sans this way is deliberate: all-mono is the purist choice and
it makes paragraphs tiring and everything look the same. Mono where the
machine speaks, sans where Minh speaks.

### Motion

Short and purposeful: the login auto-type (~1.2s total), a 120ms fade when a
section becomes active, the terminal drawer slide. Everything is disabled
under `prefers-reduced-motion`. No parallax — `react-scroll-parallax` goes.

## 5. Architecture

```
src/
  data/             ← all content, zero JSX. This is what gets edited on
    profile.js         "update portfolio" days.
    experience.js
    projects.js
    skills.js
  engine/           ← the command engine. Pure, unit-tested.
    commands.js        registry: juju switch|status|models, help, clear, whoami, cat
    parse.js           tokenizer + dispatcher
    useShell.js        history/output state; run(cmd) used by BOTH buttons and input
  components/
    Shell/             StatusBar, TerminalDrawer, ThemeToggle
    Login/             LoginCard, Motd
    Experience/        JujuStatus (list-as-table), RoleRow
    Projects/          TerraformPlan, HclBlock, ProjectCard, Topology (stretch)
    Skills/            Pipeline, Stage, Job
    Contact/
    primitives/        Section, Eyebrow, Chip, Prompt
  styles/
    tokens.css         the two palettes + type scale + spacing
    base.css           reset, focus rings, reduced-motion
  App.jsx
```

Key rule: **one dispatch path.** A nav button doesn't scroll — it calls
`run("juju switch experience")`. The engine scrolls, updates the hash, and
appends to the terminal. Typing the same thing in the drawer hits the same
function. That is what makes the terminal honest rather than theatrical.

URL sync is hash-based (`#experience`) because GitHub Pages has no SPA
fallback — real paths would 404 on refresh.

## 6. Dependencies (security-conscious)

**Remove** (fewer packages is the best audit result):
- `react-scroll-parallax`, `react-scroll` — replaced by native scroll + hash.
- `font-awesome` v4 (2016, unmaintained) — icons become inline SVG.
- `web-vitals` — unused beyond the CRA boilerplate.
- Dead code: `RoomAssigner`, `StudentTable`, `CreateEntry` (imported, never
  rendered), the old `Loading` splash, `PathDrawing` art.

**Keep**: `react`, `react-dom`, `motion` (already present, maintained, used
for the few animations).

**Add** (each pinned exact, checked with `npm view` for maintainers + last
publish, `npm install-scripts ls` for lifecycle scripts, `npm audit` after):
- `vite`, `@vitejs/plugin-react` — see §7.
- `vitest`, `@testing-library/react`, `@testing-library/jest-dom` — tests for
  the engine and a11y smoke tests. (RTL/jest-dom already present.)
- `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono` —
  static font files, no JS.
- **Not** adding: xterm.js (heavy, overkill — the drawer is a ~150-line
  component), a router, a state library, an icon library, a syntax
  highlighter (the HCL blocks are pre-tokenized in data; a tiny renderer
  colors them).

## 7. Decision: migrate off Create React App

Current state: `react-scripts@5.0.1` (last release 2022; CRA officially sunset
Feb 2025). `npm audit` on this repo reports **69 vulnerabilities, 4 critical**,
all inside the react-scripts tree. None of it ships to the browser — it's
webpack-dev-server, nth-check, postcss — but `npm audit` can't tell that, and
neither can a hiring manager who clones the repo.

Recommendation: **migrate to Vite** in Phase 0. Mechanical for a CRA app of
this size (~1 hour), drops the audit to ~0, builds in seconds, and is itself a
legible engineering decision on a portfolio about platform engineering. The
GitHub Actions workflow needs a one-line change (`build/` → `dist/`) and
`homepage` becomes Vite's `base`.

If we stay on CRA, everything else in this plan still works; the audit number
just stays ugly.

## 8. Responsive, SEO, accessibility — built in, not bolted on

### Responsive
- Mobile-first CSS; breakpoints at 480 / 768 / 1080.
- Terminal drawer collapsed by default under 768px; status bar condenses to
  `minh@portfolio ▸ experience`.
- `juju status` → stacked cards; pipeline → vertical; HCL → `overflow-x: auto`
  inside its block, the page never scrolls horizontally.
- Touch targets ≥ 44px; hover states have focus/active equivalents.

### SEO
- One indexable page; all content present in the DOM on first render
  regardless of login state.
- `<title>`, meta description, canonical, Open Graph + Twitter card with a
  generated OG image (a terminal-styled 1200×630 PNG), `theme-color` for both
  schemes.
- JSON-LD `Person`: name, jobTitle, worksFor Canonical, alumniOf University
  of Rochester, `sameAs` LinkedIn/GitHub.
- Strict heading hierarchy (one `<h1>` = the MOTD name), landmarks
  (`header`/`main`/`nav`/`footer`), `lang="en"`.
- `sitemap.xml` + existing `robots.txt`.
- Performance *is* SEO: no parallax lib, fonts subset + self-hosted, project
  screenshots → WebP with explicit dimensions, Lighthouse ≥ 95 across the
  board as the acceptance bar.
- Optional later: a build-time `renderToString` prerender (zero new packages)
  so the HTML is complete before JS runs.

### Accessibility
- Terminal output is a `role="log"` region with `aria-live="polite"`. The
  auto-typed text is `aria-hidden`; the completed line is announced once via
  a visually-hidden sibling — screen readers never hear letter-by-letter.
- Every click-to-command control is a real `<button>` whose accessible name
  is plain language ("Switch to Experience"); the command text is decoration.
- Skip link; login dismissible via button and `Esc`; focus moves to the
  section heading after `juju switch`.
- `prefers-reduced-motion` honored globally; `prefers-color-scheme` honored
  with a persisted override.
- Contrast ≥ 4.5:1 everywhere; status never conveyed by color alone.
- Visible accent focus rings; full keyboard walkthrough as a checklist item.
- `<noscript>` fallback: name, role, and the four links.
- Verification: axe DevTools + a keyboard-only pass + one screen-reader pass
  (NVDA on Windows) before the PR is marked ready.

## 9. Phases

Each phase is one or more commits on this branch. The branch builds and is
previewable (`npm run dev`) at the end of every phase.

| # | Phase | Deliverable | Status |
| - | ----- | ----------- | ------ |
| 0 | **Foundation** | Vite migration (§7); dead deps + dead code removed; `data/` extracted from the current components; `tokens.css` with both palettes; fonts; base layout. Same content, new skeleton, workflow updated. | done — `npm audit`: 0 |
| 1 | **Shell** | Status bar, terminal drawer, command engine with tests, hash URL sync, theme toggle. Nav works via click → command. | done |
| 2 | **Login** | JAAS-styled card, scripted auto-type, MOTD hero, skip/Esc, reduced-motion path. | done — MOTD is `inert` while locked |
| 3 | **Experience** | `juju status` table/cards from `experience.js`, expandable rows, cloud chips. | done |
| 4 | **Projects** | Terraform plan section, HCL blocks, project cards, WebP screenshots. Topology SVG if time allows. | done (no topology SVG) |
| 5 | **Skills + Contact** | Pipeline; `juju expose contact`; footer. | done |
| 6 | **SEO / a11y / perf** | Meta + JSON-LD + OG image; real deploy status from the GitHub API with build-time SHA fallback; Lighthouse + axe + keyboard passes. | done — Lighthouse 100/100/100/100 desktop, 98/100/100/100 mobile; axe 0 violations across 5 states; NVDA pass still to do by hand |
| 7 | **Ship** | README rewrite; PR; merge → Actions deploys. | in progress |

## 10. Revision: the page is the transcript (2026-09-06)

The docked terminal drawer duplicated what the page already was: a
prompt line above each section followed by its output. It was removed,
and the page now reads as one terminal from top to bottom.

- Each section opens with a real prompt line (`minh@portfolio:~$ …`, with
  copy and run) that types itself the first time it scrolls into view
  (≤0.7s, once per load). Section titles are `# comment` lines.
- **Every unit of output prints as it enters the viewport** — each status
  row, project, pipeline stage, contact row, and MOTD line carries
  `data-print`. A single IntersectionObserver marks units printed with a
  40ms stagger per unit; CSS reveals them only once their section's
  command has finished typing (`data-ready`). If output reaches the
  viewport before its prompt was seen (fast scroll), the section starts
  the typing itself so nothing is ever stuck unwritten.
- Safety rails: `html.js` is added only when IntersectionObserver exists,
  so without it nothing is hidden; `prefers-reduced-motion` shows
  everything instantly; content is always in the DOM for crawlers and
  assistive tech; the full command is always in the accessible name.
- Units unroll **top to bottom** (a clip-path wipe from the top edge),
  not fade up. **Scrolling back up reverses it**: a unit that leaves
  through the bottom of the viewport unprints, and a prompt that leaves
  that way un-types (`data-ready` returns to false), so the way down
  replays. Units that leave through the top stay, like scrollback.
- **Bridges** (`src/data/bridges.js`) sit between sections: muted,
  non-interactive command/response pairs that make the session logically
  continuous — `juju models` → `juju switch experience` before
  Experience; `cd ~/projects && ls` → `terraform init` before Projects;
  `git log` → `gh run list` before Skills (real SHAs from this repo);
  `juju status contact` (not exposed yet) before Contact; `history | tail`
  before the Transcript. Same typing/printing mechanics, none of the
  emphasis; `aria-hidden`, since nothing in them is unique information.
- The MOTD is the first entry: `$ juju login` types once the card resolves,
  then the MOTD prints line by line.
- The live prompt is one fixed line at the bottom of the viewport. Section
  commands scroll to their section; everything else appends to a
  **Transcript** section at the end of the page, which is an `aria-live`
  log, and the page scrolls there. `/` focuses the prompt.

## 11. Open items

- **Canonical role content.** The resume PDF predates the Canonical role and
  the site's own copy is a single line. The MOTD and the `canonical` status
  row need: team/product, what Minh builds, the stack. Placeholders are
  clearly marked `TODO(minh)` in `data/` until provided. Same for Inter.play
  Lab.
- **Resume PDF is stale** (lists Master's 5/2026 as the headline, no
  Canonical). Worth refreshing before the redesign ships; the site links to it.
- Topology SVG per project is a stretch goal, not a commitment.
