import { SECTIONS } from "../../engine/sections";
import { switchCommand } from "../../engine/commands";
import { PROFILE } from "../../data/profile";
import { relativeTime } from "../../hooks/useDeployStatus";
import { PROMPT_INPUT_ID } from "./PromptLine";
import styles from "./StatusBar.module.css";

const THEME_GLYPH = { system: "◐", light: "○", dark: "●" };
const THEME_NEXT = { system: "light", light: "dark", dark: "system" };

// Fixed top bar. Left: user@host. Middle: the window list — this *is* the
// primary nav; each window is a real button that runs `juju switch`.
// Right: real deploy status, theme, and a shortcut to the prompt.

export default function StatusBar({ current, run, theme, cycleTheme, deploy }) {
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
                {/* The index and the active "*" are CSS generated content
                    (with empty alt text), so the button's visible text and
                    its accessible name are the same word. */}
                <button
                  type="button"
                  className={`${styles.window} ${active ? styles.windowActive : ""}`}
                  aria-current={active ? "true" : undefined}
                  data-index={i}
                  onClick={() => run(s.id === "login" ? "juju login" : switchCommand(s.id))}
                >
                  {s.id}
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
          onClick={() => document.getElementById(PROMPT_INPUT_ID)?.focus()}
          aria-label="Focus the prompt"
          title="Focus the prompt (/)"
        >
          <span aria-hidden="true">{">_"}</span>
        </button>
      </div>
    </header>
  );
}
