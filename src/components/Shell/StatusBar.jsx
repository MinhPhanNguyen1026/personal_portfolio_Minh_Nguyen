import { SECTIONS } from "../../engine/sections";
import { switchCommand } from "../../engine/commands";
import { PROFILE } from "../../data/profile";
import { relativeTime } from "../../hooks/useDeployStatus";
import styles from "./StatusBar.module.css";

const THEME_GLYPH = { system: "◐", light: "○", dark: "●" };
const THEME_NEXT = { system: "light", light: "dark", dark: "system" };

// Fixed top bar. Left: user@host. Middle: the window list — this *is* the
// primary nav; each window is a real button that runs `juju switch`.
// Right: real deploy status, theme, terminal toggle.

export default function StatusBar({ current, run, theme, cycleTheme, deploy, drawerOpen, toggleDrawer }) {
  return (
    <header className={styles.bar} role="banner">
      <a className={styles.user} href="#login" onClick={(e) => { e.preventDefault(); run(switchCommand("login")); }}>
        <span className={styles.handle}>{PROFILE.handle}</span>
        <span className={styles.at}>@</span>
        <span>{PROFILE.host}</span>
      </a>

      <nav className={styles.windows} aria-label="Sections">
        <ul className={styles.windowList}>
          {SECTIONS.map((s, i) => {
            const active = s.id === current;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  className={`${styles.window} ${active ? styles.windowActive : ""}`}
                  aria-current={active ? "true" : undefined}
                  aria-label={`Switch to ${s.title}`}
                  onClick={() => run(s.id === "login" ? "juju login" : switchCommand(s.id))}
                >
                  <span className={styles.windowIndex} aria-hidden="true">{i}</span>
                  <span className={styles.windowName}>{s.id}</span>
                  {active ? <span className={styles.windowMark} aria-hidden="true">*</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.right}>
        <a
          className={styles.deploy}
          href={deploy.url}
          target="_blank"
          rel="noreferrer noopener"
          title={deploy.source === "actions" ? "Last successful deploy (GitHub Actions)" : "Commit this build was made from"}
        >
          <span className={`${styles.dot} ${styles.dotOk}`} aria-hidden="true" />
          <span className={styles.sha}>{deploy.sha}</span>
          <span className={styles.when}>{deploy.source === "actions" ? `deployed ${relativeTime(deploy.at)}` : "build"}</span>
          <span className="sr-only">{deploy.source === "actions" ? "Last successful deploy" : "Built from commit"} {deploy.sha}</span>
        </a>

        <button
          type="button"
          className={styles.iconBtn}
          onClick={cycleTheme}
          aria-label={`Theme: ${theme}. Switch to ${THEME_NEXT[theme]}.`}
          title={`Theme: ${theme}`}
        >
          <span aria-hidden="true">{THEME_GLYPH[theme]}</span>
          <span className={styles.iconLabel} aria-hidden="true">{theme}</span>
        </button>

        <button
          type="button"
          className={styles.iconBtn}
          onClick={toggleDrawer}
          aria-expanded={drawerOpen}
          aria-controls="terminal-drawer"
          aria-label={drawerOpen ? "Collapse terminal" : "Expand terminal"}
        >
          <span aria-hidden="true">{">_"}</span>
        </button>
      </div>
    </header>
  );
}
