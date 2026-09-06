# Running and testing locally

Every block below is meant to be pasted as-is into a terminal opened at
the repo root. Windows (PowerShell), macOS, and Linux all work the same.

## 0. Prerequisites

- **Node 20 or newer** — check with `node -v`. If the command isn't
  recognised right after installing Node, open a new terminal; the old one
  has the old PATH.
- **Google Chrome** — only needed for the browser audits in §6.
- **Windows PowerShell only:** if `npm` fails with *"running scripts is
  disabled on this system"*, run this once (no admin needed):

  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```

  It applies to your account only and allows local scripts like npm's
  shim. Alternatively, `npm.cmd run dev` works without changing anything.

## 1. First time (or after switching branches)

```sh
npm ci
```

`npm ci` installs exactly what the lockfile says. `main` and the redesign
branch have completely different dependencies, so run this again whenever
you switch between them.

## 2. Run the portfolio

```sh
npm run dev
```

Opens **http://localhost:5173/personal_portfolio_Minh_Nguyen/** in your
browser automatically. Edits hot-reload. `Ctrl+C` stops it.

> The `/personal_portfolio_Minh_Nguyen/` part of the URL is required — the
> site is served under the repo name because that's how GitHub Pages serves
> it. Plain `http://localhost:5173/` is blank on purpose.

Things to try once it's open:

- Click **Log in as minh** — the credentials type themselves, then
  `$ juju login` types and the MOTD prints.
- Scroll slowly: each section's prompt types itself as it comes into view,
  then its output prints row by row. Scroll fast and sections start
  themselves. Click **run ▸** on any prompt to replay it.
- Type at the prompt at the bottom: `help`, `juju status`, `theme light`,
  `juju logout`. Output lands in the Transcript section at the end of the
  page; section commands scroll to their section.
- Press `/` anywhere to jump to the prompt.
- Make the window narrow (or use device emulation) to see the mobile layout.

## 3. Run the theme board (design reference)

```sh
npm run theme
```

Opens **http://localhost:5174/theme-board.html** — both palettes, the type
pairing, and mock-ups of every surface. Click **Log in** on it to feel the
intro; toggle **Ink / Paper** for the two themes. It's a single static file
at `docs/theme-board.html` and mirrors `src/styles/tokens.css`.

The app and the theme board use different ports, so both can run at once.

## 4. Test

```sh
npm test
```

Runs the unit and component tests once (27 at the time of writing: command
engine, click-fills-command contract, login state machine, theme cycling,
status table). For a watch mode while editing:

```sh
npm run test:watch
```

The single command that has to pass before anything ships — tests, then a
production build — is:

```sh
npm run check
```

## 5. Check what will actually deploy

```sh
npm run build
npm run preview
```

`build` writes the production bundle to `dist/`; `preview` serves it at
**http://localhost:4173/personal_portfolio_Minh_Nguyen/** and opens it.
This is the closest thing to the live site short of merging.

## 6. Browser audits (optional, what the Lighthouse / axe numbers come from)

These live in `tools/audit/` with their **own** dependency tree so the
site's `npm audit` stays at 0 and the root `npm ci` stays fast. One-time
setup:

```sh
cd tools/audit
npm ci
cd ../..
```

They drive the real Chrome on your machine — nothing is downloaded. (No
Chrome? Run `npx playwright install chromium` inside `tools/audit`, then
prefix the commands below with `PW_CHANNEL=bundled`.)

Each audit needs a server running in **another terminal**:

| Audit | Terminal 1 (root) | Terminal 2 (root) | Output |
| --- | --- | --- | --- |
| Accessibility (axe, keyboard, reduced motion) | `npm run dev` | `npm --prefix tools/audit run a11y` | printed; exit 2 on violations |
| Scroll ↔ URL sync and command navigation | `npm run dev` | `npm --prefix tools/audit run scroll` | printed; exit 2 on failure |
| Screenshots of every state | `npm run dev` | `npm --prefix tools/audit run shots` | `tools/audit/out/shots/*.png` |
| Lighthouse, desktop + mobile | `npm run build && npm run preview` | `npm --prefix tools/audit run lighthouse` | scores printed; HTML reports in `tools/audit/out/` |

Screenshots of a single section, desktop and mobile:

```sh
npm --prefix tools/audit run shots -- section=projects
```

## 7. When something's off

| Symptom | Fix |
| --- | --- |
| `node` / `npm` not recognised | Open a new terminal (PATH is read at terminal start). |
| `npm.ps1 cannot be loaded because running scripts is disabled` | PowerShell's default policy. See §0 — one command fixes it, or use `npm.cmd`. |
| Blank page at `localhost:5173` | Add the path: `/personal_portfolio_Minh_Nguyen/`. `npm run dev` opens the right one. |
| `Port 5173 is already in use` | A previous `npm run dev` is still running. Find and close it, or `Ctrl+C` in that terminal. |
| Weird errors after `git checkout` | `npm ci` — the branches don't share dependencies. |
| Audit says "Nothing is serving …" | Start the matching server from the table in §6 first. |
| Playwright can't find Chrome | See the note in §6 about `PW_CHANNEL=bundled`. |

## 8. Ship

`main` is protected. Push a branch, open a PR, merge — GitHub Actions
tests, builds, and publishes `dist/` to `gh-pages`. There is nothing to run
by hand and `gh-pages` should never be pushed to directly.
