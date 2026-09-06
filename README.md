# minh@portfolio

Minh Nguyen's portfolio, built as a control plane you can navigate.

> **Live:** https://minhphannguyen1026.github.io/personal_portfolio_Minh_Nguyen/

You "log in" (one click — the credentials type themselves), get a MOTD, and
then move around the way an operator moves around infrastructure: `juju
switch` between sections, read `juju status` for experience, inspect a
`terraform plan` for projects, watch a CI pipeline for skills. Every
navigation click is a real command that gets echoed into the terminal
drawer, and anything you could click you can also type.

The design brief and rationale live in [docs/REDESIGN_PLAN.md](docs/REDESIGN_PLAN.md).

## Stack

- **React 18 + Vite 8**, tested with **Vitest 4** and Testing Library.
- No router, no state library, no terminal library, no icon library.
  Self-hosted Inter + JetBrains Mono via `@fontsource-variable`.
- `npm audit` reports 0 vulnerabilities. Every dependency is pinned exact.
- Deployed by GitHub Actions to the `gh-pages` branch on every push to `main`.

## Develop

```sh
npm ci          # install exactly what's in the lockfile
npm run dev     # opens http://localhost:5173/personal_portfolio_Minh_Nguyen/
npm run theme   # opens the theme board (docs/theme-board.html) on :5174
npm test        # vitest, once
npm run check   # tests + production build — the pre-ship gate
npm run preview # build first, then serve dist/ the way Pages will
```

Node 20+ (CI uses 20; developed on 24). Step-by-step, including the
browser audits behind the Lighthouse/axe numbers:
**[docs/RUNNING.md](docs/RUNNING.md)**.

## Edit content

All copy lives in `src/data/` — components only render it.

| File                     | What it holds                                         |
| ------------------------ | ----------------------------------------------------- |
| `src/data/profile.js`    | Name, title, employer, tagline, links, education. Also feeds the SEO tags and JSON-LD at build time. |
| `src/data/experience.js` | Roles, modelled like `juju status` applications (`app`, `status`, `charm`, `period`, `details`). |
| `src/data/projects.js`   | Projects, modelled as Terraform resources (`type`, `id`, `attrs`, `links`). |
| `src/data/skills.js`     | Skills as pipeline stages and jobs; `usedAt` links a job to roles/projects. |

Search for `TODO(minh)` for the placeholders still waiting on real copy.

Project screenshots are WebP in `src/assets/projects/`. The resume PDF is
in `public/`.

## Terminal commands

Type `help` in the drawer (or press `/` to focus it). The engine lives in
`src/engine/commands.js`; the nav buttons run the same `execute()` the
input does.

```
juju switch <controller>   go to a section (experience, projects, skills, contact)
juju controllers           list sections
juju status                what's running in the current section
juju whoami                controller, model, and user
juju login | logout        replay the login / lock the hero again
theme [dark|light|system]  colour scheme
ls, pwd, cat, whoami, clear
```

## Theme

Design tokens are in `src/styles/tokens.css`: **Ink** (dark, default) and
**Paper** (light). The theme follows the OS unless the toggle in the status
bar overrides it; the choice persists in `localStorage`. Every text/surface
pair meets WCAG AA and was checked with axe across the app's states.

## Accessibility

- Lighthouse accessibility 100 (desktop and mobile); axe: 0 violations
  across locked, open, expanded, light, and mobile states.
- The terminal transcript is an `aria-live` log. Nav controls are real
  buttons named by their visible text.
- The login card is dismissible with Skip or `Esc`; `prefers-reduced-motion`
  skips the typing animation; the MOTD is `inert` while the card is up so
  nothing focusable hides behind it.
- The status table keeps explicit ARIA row/cell roles so it still reads as
  a table when CSS turns rows into cards on narrow screens.

## Deploy

`.github/workflows/deploy.yml` runs tests, builds, and publishes `dist/` to
the `gh-pages` branch on every push to `main`. `main` is protected — open a
PR. There is nothing to run by hand; don't push to `gh-pages` directly.

The status bar's deploy pill shows the last successful Actions run (from
the GitHub API), falling back to the commit SHA baked in at build time.

## Layout

```
src/
  data/           content — the only place "update portfolio" edits go
  engine/         command parser, registry, and the useShell hook (tested)
  hooks/          theme, active section + URL sync, deploy status
  components/
    Shell/        status bar (nav), terminal drawer
    Login/        login card → MOTD hero
    Experience/   juju status table
    Projects/     terraform plan cards
    Skills/       CI pipeline
    Contact/      juju expose contact
    primitives/   Section
  styles/         tokens (both themes), base
```
