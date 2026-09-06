import { useEffect, useRef, useState } from "react";
import { PROFILE } from "../../data/profile";
import { ALL_EXPERIENCE, CURRENT_ROLES } from "../../data/experience";
import { PROJECTS } from "../../data/projects";
import { PIPELINE } from "../../data/skills";
import { SECTIONS } from "../../engine/sections";
import { relativeTime } from "../../hooks/useDeployStatus";
import CommandBox, { canAnimate } from "../primitives/CommandBox";
import styles from "./Login.module.css";

// The hero. Three phases, owned by App so the shell can drive them:
//   locked  → the login card covers a blurred MOTD
//   typing  → credentials auto-type (skipped under reduced motion)
//   open    → the MOTD, sharp: `$ juju login` types, then it prints
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

function LoginCard({ phase, onLogin, onDone }) {
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
      </div>
      <p className={styles.hint} aria-hidden="true">
        or press <kbd>Esc</kbd>
      </p>
      <p className="sr-only" aria-live="polite">
        {typing ? "Authenticating." : ""}
      </p>
    </div>
  );
}

// The block Ubuntu prints after login — `landscape-sysinfo` — with this
// site's real numbers in the usual slots.
function SysInfo({ deploy, when, ready }) {
  const skills = PIPELINE.reduce((n, s) => n + s.jobs.length, 0);
  const rows = [
    ["System load:", "0.08", "Sections:", `${SECTIONS.length}`],
    ["Usage of /:", `${PROJECTS.length} projects`, "Roles:", `${ALL_EXPERIENCE.length} (${CURRENT_ROLES.length} active)`],
    ["Memory usage:", `${skills} skills`, "Users logged in:", "1 (you)"],
    ["Deployed:", deploy.source === "actions" ? `${deploy.sha} · ${relativeTime(deploy.at)}` : `${deploy.sha} (this build)`, "Controller:", `${PROFILE.handle} · juju 3.6.4`],
  ];
  // Line-by-line: each unit carries its own delay so the block visibly
  // runs, rather than arriving in the same batch as the MOTD above it.
  const delay = (i) => `${i * 110}ms`;
  return (
    <div className={styles.sysinfo} aria-label="System information" data-ready={ready ? "true" : "false"}>
      <p className={styles.sysinfoTitle} data-print data-delay={delay(0)}>
        System information as of {when}
      </p>
      <dl className={styles.sysinfoGrid}>
        {rows.map(([k1, v1, k2, v2], i) => (
          <div key={k1} className={styles.sysinfoRow} data-print data-delay={delay(i + 1)}>
            <dt>{k1}</dt>
            <dd>{v1}</dd>
            <dt>{k2}</dt>
            <dd>{v2}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.sysinfoNote} data-print data-delay={delay(rows.length + 1)}>
        0 updates can be applied immediately.
      </p>
    </div>
  );
}

function Motd({ open, run, lastLogin, deploy }) {
  // While the card covers it, the MOTD is inert: still in the DOM for
  // crawlers, but out of the tab order so nothing focusable hides behind
  // the lock screen. (String value: React 18 doesn't know `inert`.)
  const inert = open ? {} : { inert: "" };
  // The first transcript entry: `$ juju login` types once the card is
  // gone, and only then does the MOTD print. The system-information
  // block is a second program that runs after it. Logging out resets
  // both, so logging in again replays the whole entry.
  const [ready, setReady] = useState(() => !canAnimate());
  const [sysReady, setSysReady] = useState(() => !canAnimate());
  useEffect(() => {
    if (!open && canAnimate()) {
      setReady(false);
      setSysReady(false);
    }
  }, [open]);
  useEffect(() => {
    if (!ready) {
      setSysReady(false);
      return undefined;
    }
    if (!canAnimate()) {
      setSysReady(true);
      return undefined;
    }
    const t = setTimeout(() => setSysReady(true), 700);
    return () => clearTimeout(t);
  }, [ready]);
  return (
    <div className={styles.motd} data-open={open ? "true" : "false"} {...inert}>
      <CommandBox command="juju login" active={open} onRun={(c) => run(c)} onTyped={() => setReady(true)} onReset={() => setReady(false)} />
      <div className={styles.output} data-ready={ready ? "true" : "false"}>
        <pre className={styles.banner} aria-hidden="true" data-print>
          {BANNER}
          {"\n"}Last login: {lastLogin} from your browser
        </pre>

        <h1 id="login-title" className={styles.name} tabIndex={-1} data-section-heading data-print>
          {PROFILE.firstName} <span className={styles.nameAccent}>{PROFILE.lastName}</span>
        </h1>

        <p className={styles.tagline} data-print>
          {PROFILE.title} at{" "}
          <a href={PROFILE.employer.href} target="_blank" rel="noreferrer noopener">
            {PROFILE.employer.name}
          </a>
          . {PROFILE.tagline}
        </p>
        <p className={styles.work} data-print>
          {PROFILE.currentWork}
        </p>

        <ul className={styles.chips} aria-label="Current status" data-print>
          {CURRENT_ROLES.map((r) => (
            <li key={r.app} className={styles.chip}>
              <span className={`${styles.dot} ${styles.dotOk}`} aria-hidden="true" />
              <span className={styles.chipApp}>{r.app}</span>
              <span className={styles.chipStatus}>active</span>
            </li>
          ))}
          <li className={styles.chip}>{PROFILE.location}</li>
        </ul>

        <ul className={styles.links} aria-label="Links" data-print>
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

        <SysInfo deploy={deploy} when={lastLogin} ready={sysReady} />
      </div>
    </div>
  );
}

export default function Login({ phase, setPhase, run, deploy }) {
  const [lastLogin] = useState(() =>
    new Date().toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  );
  const open = phase === "open";
  const wasOpen = useRef(open);

  function login() {
    setPhase(prefersReducedMotion() ? "open" : "typing");
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
    <section id="login" className={styles.hero} aria-labelledby="login-title" data-open={open ? "true" : "false"}>
      <div className={styles.inner}>
        <Motd open={open} run={run} lastLogin={lastLogin} deploy={deploy} />
        {!open ? (
          <div className={styles.overlay}>
            <LoginCard phase={phase} onLogin={login} onDone={() => setPhase("open")} />
          </div>
        ) : null}
      </div>
      <p className="sr-only" aria-live="polite">
        {open ? `Logged in as ${PROFILE.handle}.` : ""}
      </p>
    </section>
  );
}
