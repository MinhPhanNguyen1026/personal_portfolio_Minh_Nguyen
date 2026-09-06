import { useCallback, useEffect, useState } from "react";

import { PROFILE } from "./data/profile";

import { useTheme } from "./hooks/useTheme";
import { useSection } from "./hooks/useSection";
import { useDeployStatus } from "./hooks/useDeployStatus";
import { useShell } from "./engine/useShell";
import { DEFAULT_SECTION, findSection } from "./engine/sections";

import StatusBar from "./components/Shell/StatusBar";
import TerminalDrawer from "./components/Shell/TerminalDrawer";
import Login, { SESSION_KEY } from "./components/Login/Login";
import Section from "./components/primitives/Section";
import Experience from "./components/Experience/Experience";
import Projects from "./components/Projects/Projects";
import Skills from "./components/Skills/Skills";
import Contact from "./components/Contact/Contact";

import styles from "./App.module.css";

function drawerDefault() {
  try {
    return window.matchMedia("(min-width: 769px)").matches;
  } catch {
    return false;
  }
}

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

// Start logged in when this session already did the login, or when the
// visitor deep-linked past the hero — nobody should sit through a login
// to reach a link someone sent them.
function initialLoginPhase() {
  try {
    if (sessionStorage.getItem(SESSION_KEY) === "1") return "open";
  } catch {
    /* ignore */
  }
  const hash = window.location.hash.replace(/^#/, "");
  if (hash && hash !== DEFAULT_SECTION && findSection(hash)) return "open";
  return "locked";
}

export default function App() {
  const { theme, setTheme, cycle } = useTheme();
  const { current, switchTo } = useSection();
  const deploy = useDeployStatus();
  const [drawerOpen, setDrawerOpen] = useState(drawerDefault);
  const [loginPhase, setLoginPhase] = useState(initialLoginPhase);
  const loggedIn = loginPhase === "open";

  // `juju login` replays the login; `juju logout` locks the hero again.
  const onLogin = useCallback(() => setLoginPhase(prefersReducedMotion() ? "open" : "typing"), []);
  const onLogout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setLoginPhase("locked");
  }, []);

  const shell = useShell({ current, theme, loggedIn, switchTo, setTheme, onLogin, onLogout });

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
        <Login phase={loginPhase} setPhase={setLoginPhase} run={shell.run} />

        <Section
          id="experience"
          title="Experience"
          command={findSection("experience").command}
          onRun={shell.run}
          lead="Employers as applications. Current roles are active; the rest ran their course. Select an app for details."
        >
          <Experience />
        </Section>

        <Section
          id="projects"
          title="Projects"
          command={findSection("projects").command}
          onRun={shell.run}
          lead="Shipped work, expressed as the plan that would build it."
        >
          <Projects />
        </Section>

        <Section
          id="skills"
          title="Skills"
          command={findSection("skills").command}
          onRun={shell.run}
          lead="The pipeline that builds everything else. Select a job to see where it ran."
        >
          <Skills />
        </Section>

        <Section id="contact" title="Contact" command={findSection("contact").command} onRun={shell.run} lead="Everything is exposed. Pick a channel.">
          <Contact />
        </Section>

        <footer className={styles.footer}>
          <p>
            Designed and developed by {PROFILE.name}. Build <code>{__BUILD_SHA__}</code>.
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
