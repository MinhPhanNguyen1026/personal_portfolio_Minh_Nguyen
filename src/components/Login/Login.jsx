import { useEffect, useRef, useState } from "react";
import { PROFILE } from "../../data/profile";
import { CURRENT_ROLES } from "../../data/experience";
import { switchCommand } from "../../engine/commands";
import styles from "./Login.module.css";

// The hero. Three phases, owned by App so the shell can drive them:
//   locked  → the login card covers a blurred MOTD
//   typing  → credentials auto-type (skipped under reduced motion)
//   open    → the MOTD, sharp
// The MOTD is always rendered and holds the page's h1, so crawlers and
// assistive tech reach the content whether or not the card is showing.

export const SESSION_KEY = "portfolio.loggedIn";
const PASSWORD = "••••••••••";
const BANNER = `Welcome to ${PROFILE.handle}-${PROFILE.host} (Juju 3.6.4 · MicroK8s 1.31 · Ubuntu 24.04 LTS)`;

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function rememberLogin() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

function useTypewriter(active, text, speed, delay, onDone) {
  const [typed, setTyped] = useState("");
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    if (!active) {
      setTyped("");
      return undefined;
    }
    let i = 0;
    let t;
    const step = () => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i < text.length) t = setTimeout(step, speed + Math.random() * speed * 0.6);
      else t = setTimeout(() => done.current?.(), 260);
    };
    t = setTimeout(step, delay);
    return () => clearTimeout(t);
  }, [active, text, speed, delay]);

  return typed;
}

function LoginCard({ phase, onLogin, onSkip, onDone }) {
  const typing = phase === "typing";
  const [stage, setStage] = useState("user"); // user → pass → done
  const user = useTypewriter(typing, PROFILE.handle, 80, 150, () => setStage("pass"));
  const pass = useTypewriter(typing && stage !== "user", PASSWORD, 40, 120, () => setStage("done"));

  useEffect(() => {
    if (!typing) setStage("user");
  }, [typing]);

  useEffect(() => {
    if (typing && stage === "done") onDone();
  }, [typing, stage, onDone]);

  return (
    <div className={styles.card} role="dialog" aria-labelledby="login-card-title" aria-describedby="login-card-sub">
      <div className={styles.cardHead}>
        <h2 id="login-card-title" className={styles.cardTitle}>
          Log in to {PROFILE.handle}-{PROFILE.host}
        </h2>
        <p id="login-card-sub" className={styles.cardSub}>
          controller {PROFILE.handle} · juju 3.6.4 · JAAS-compatible
        </p>
      </div>

      <div className={styles.fields} aria-hidden="true">
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Username</span>
          <div className={styles.box}>
            <span>{user}</span>
            {typing && stage === "user" ? <span className={styles.caret} /> : null}
          </div>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Password</span>
          <div className={styles.box}>
            <span>{pass}</span>
            {typing && stage === "pass" ? <span className={styles.caret} /> : null}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={onLogin} disabled={typing} autoFocus>
          {typing ? "Authenticating…" : `Log in as ${PROFILE.handle}`}
        </button>
        <button type="button" className={styles.skip} onClick={onSkip}>
          Skip <span aria-hidden="true">→</span>
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {typing ? "Authenticating." : ""}
      </p>
    </div>
  );
}

function Motd({ open, run, lastLogin }) {
  return (
    <div className={styles.motd} data-open={open ? "true" : "false"}>
      <pre className={styles.banner} aria-hidden="true">
        {BANNER}
        {"\n"}Last login: {lastLogin} from your browser
      </pre>

      <h1 id="login-title" className={styles.name} tabIndex={-1} data-section-heading>
        {PROFILE.firstName} <span className={styles.nameAccent}>{PROFILE.lastName}</span>
      </h1>

      <p className={styles.tagline}>
        {PROFILE.title} at{" "}
        <a href={PROFILE.employer.href} target="_blank" rel="noreferrer noopener">
          {PROFILE.employer.name}
        </a>
        . {PROFILE.tagline}
      </p>

      <ul className={styles.chips} aria-label="Current status">
        {CURRENT_ROLES.map((r) => (
          <li key={r.app} className={styles.chip}>
            <span className={`${styles.dot} ${styles.dotOk}`} aria-hidden="true" />
            <span className={styles.chipApp}>{r.app}</span>
            <span className={styles.chipStatus}>active</span>
          </li>
        ))}
        <li className={styles.chip}>{PROFILE.location}</li>
      </ul>

      <ul className={styles.links} aria-label="Links">
        {PROFILE.links.map((l) => {
          const external = /^(https?:|mailto:)/.test(l.href);
          return (
            <li key={l.key}>
              <a
                className={styles.link}
                href={external ? l.href : `${import.meta.env.BASE_URL}${l.href}`}
                download={l.download}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noreferrer noopener" : undefined}
              >
                {l.label}
                <span className={styles.linkGlyph} aria-hidden="true">
                  {l.download ? "↓" : l.external ? "↗" : "›"}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <button type="button" className={styles.promptLine} onClick={() => run(switchCommand("experience"))} aria-label="Run juju switch experience">
        <span className={styles.prompt} aria-hidden="true">
          <span className={styles.promptHost}>
            {PROFILE.handle}@{PROFILE.host}:~
          </span>
          $
        </span>
        <span className={styles.cmd} aria-hidden="true">
          {switchCommand("experience")}
        </span>
        <span className={styles.caret} aria-hidden="true" />
      </button>
    </div>
  );
}

export default function Login({ phase, setPhase, run }) {
  const [lastLogin] = useState(() =>
    new Date().toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  );
  const open = phase === "open";
  const wasOpen = useRef(open);

  function login() {
    setPhase(prefersReducedMotion() ? "open" : "typing");
  }
  function skip() {
    setPhase("open");
  }

  // Hand focus to the name only when the login just happened — not on a
  // fresh load that started open — so returning visitors aren't yanked.
  useEffect(() => {
    if (open) {
      rememberLogin();
      if (!wasOpen.current) {
        document.getElementById("login-title")?.focus({ preventScroll: true });
      }
    }
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setPhase("open");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setPhase]);

  return (
    <section id="login" className={styles.hero} aria-labelledby="login-title">
      <div className={styles.inner}>
        <Motd open={open} run={run} lastLogin={lastLogin} />
        {!open ? (
          <div className={styles.overlay}>
            <LoginCard phase={phase} onLogin={login} onSkip={skip} onDone={() => setPhase("open")} />
          </div>
        ) : null}
      </div>
      <p className="sr-only" aria-live="polite">
        {open ? `Logged in as ${PROFILE.handle}.` : ""}
      </p>
    </section>
  );
}
