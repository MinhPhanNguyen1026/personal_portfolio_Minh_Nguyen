import { useCallback, useEffect, useState } from "react";

import { PROFILE } from "./data/profile";
import { CURRENT_ROLES, PREVIOUS_EXPERIENCE, VOLUNTEER_EXPERIENCE } from "./data/experience";
import { PROJECTS } from "./data/projects";
import { PIPELINE } from "./data/skills";

import { useTheme } from "./hooks/useTheme";
import { useSection } from "./hooks/useSection";
import { useDeployStatus } from "./hooks/useDeployStatus";
import { useShell } from "./engine/useShell";

import StatusBar from "./components/Shell/StatusBar";
import TerminalDrawer from "./components/Shell/TerminalDrawer";
import Section from "./components/primitives/Section";

import styles from "./App.module.css";

function drawerDefault() {
  try {
    return window.matchMedia("(min-width: 769px)").matches;
  } catch {
    return false;
  }
}

function RoleList({ roles }) {
  return (
    <ul className={styles.plainList}>
      {roles.map((r) => (
        <li key={r.app}>
          <code>{r.app}</code> — {r.company}, {r.role} <span className={styles.muted}>({r.status})</span>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const { theme, setTheme, cycle } = useTheme();
  const { current, switchTo } = useSection();
  const deploy = useDeployStatus();
  const [drawerOpen, setDrawerOpen] = useState(drawerDefault);
  const [loggedIn, setLoggedIn] = useState(false);

  // Phase 2 replaces this with the scripted login; for now `juju login`
  // just scrolls to the top.
  const onLogin = useCallback(() => setLoggedIn(false), []);

  const shell = useShell({ current, theme, loggedIn, switchTo, setTheme, onLogin });

  // Keyboard: "/" focuses the terminal like a search box would.
  useEffect(() => {
    function onKey(e) {
      if (e.key === "/" && !/input|textarea/i.test(e.target.tagName)) {
        e.preventDefault();
        setDrawerOpen(true);
        requestAnimationFrame(() => document.querySelector("#terminal-drawer input")?.focus());
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={styles.app} data-drawer={drawerOpen ? "open" : "closed"}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <StatusBar
        current={current}
        run={shell.run}
        theme={theme}
        cycleTheme={cycle}
        deploy={deploy}
        drawerOpen={drawerOpen}
        toggleDrawer={() => setDrawerOpen((o) => !o)}
      />

      <main id="main" className={styles.main}>
        {/* Phase 2: login card → MOTD. Placeholder hero keeps the h1 real. */}
        <section id="login" className={styles.hero} aria-labelledby="login-title">
          <div className={styles.heroInner}>
            <p className={styles.heroEyebrow} aria-hidden="true">
              Welcome to {PROFILE.handle}-{PROFILE.host} · Juju 3.6.4 · MicroK8s 1.31 · Ubuntu 24.04 LTS
            </p>
            <h1 id="login-title" className={styles.heroName} tabIndex={-1} data-section-heading>
              {PROFILE.firstName} <span className={styles.heroAccent}>{PROFILE.lastName}</span>
            </h1>
            <p className={styles.heroTagline}>
              {PROFILE.title} at{" "}
              <a href={PROFILE.employer.href} target="_blank" rel="noreferrer noopener">
                {PROFILE.employer.name}
              </a>
              . {PROFILE.tagline}
            </p>
          </div>
        </section>

        <Section id="experience" title="Experience" lead="Employers as applications. Current roles are active; the rest ran their course.">
          <h3 className={styles.h3}>Current</h3>
          <RoleList roles={CURRENT_ROLES} />
          <h3 className={styles.h3}>Previous</h3>
          <RoleList roles={PREVIOUS_EXPERIENCE} />
          <h3 className={styles.h3}>Volunteer</h3>
          <RoleList roles={VOLUNTEER_EXPERIENCE} />
        </Section>

        <Section id="projects" title="Projects" lead="Shipped work, expressed as the plan that would build it.">
          <ul className={styles.plainList}>
            {PROJECTS.map((p) => (
              <li key={p.id}>
                <code>
                  resource "{p.type}" "{p.id}"
                </code>{" "}
                — {p.title}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="skills" title="Skills" lead="The pipeline that builds everything else.">
          {PIPELINE.map((stage) => (
            <div key={stage.stage}>
              <h3 className={styles.h3}>{stage.stage}</h3>
              <ul className={styles.plainList}>
                {stage.jobs.map((j) => (
                  <li key={j.name}>{j.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        <Section id="contact" title="Contact" lead="Reach out on LinkedIn or email, browse the code on GitHub, or grab the resume.">
          <ul className={styles.plainList}>
            {PROFILE.links.map((l) => (
              <li key={l.key}>
                <a
                  href={l.href.startsWith("http") || l.href.startsWith("mailto:") ? l.href : `${import.meta.env.BASE_URL}${l.href}`}
                  download={l.download}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noreferrer noopener" : undefined}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <footer className={styles.footer}>
          <p>
            Designed and developed by {PROFILE.name}. Build <code>{deploy.source === "build" ? deploy.sha : __BUILD_SHA__}</code>.
          </p>
        </footer>
      </main>

      <TerminalDrawer
        history={shell.history}
        run={shell.run}
        recall={shell.recall}
        current={current}
        open={drawerOpen}
        setOpen={setDrawerOpen}
      />
    </div>
  );
}
