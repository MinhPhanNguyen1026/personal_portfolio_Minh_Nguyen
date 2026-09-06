import { useCallback, useEffect, useRef, useState } from "react";

import { PROFILE } from "./data/profile";

import { useTheme } from "./hooks/useTheme";
import { useSection } from "./hooks/useSection";
import { useDeployStatus } from "./hooks/useDeployStatus";
import { usePrintObserver } from "./hooks/usePrintObserver";
import { useShell } from "./engine/useShell";
import { DEFAULT_SECTION, findSection } from "./engine/sections";

import StatusBar from "./components/Shell/StatusBar";
import PromptLine, { PROMPT_INPUT_ID } from "./components/Shell/PromptLine";
import Transcript from "./components/Shell/Transcript";
import Login, { SESSION_KEY } from "./components/Login/Login";
import Section from "./components/primitives/Section";
import Bridge from "./components/primitives/Bridge";
import { BRIDGES } from "./data/bridges";
import Experience from "./components/Experience/Experience";
import Projects from "./components/Projects/Projects";
import Skills from "./components/Skills/Skills";
import Contact from "./components/Contact/Contact";

import styles from "./App.module.css";

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
  const [loginPhase, setLoginPhase] = useState(initialLoginPhase);
  const loggedIn = loginPhase === "open";
  // Bumped whenever a non-navigating command produced output; the effect
  // below then brings the end of the transcript into view.
  const [outputTick, setOutputTick] = useState(0);

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
  const onOutput = useCallback(() => setOutputTick((n) => n + 1), []);

  const shell = useShell({ current, theme, loggedIn, switchTo, setTheme, onLogin, onLogout, onOutput });

  // Everything in <main> prints as it scrolls into view.
  const main = useRef(null);
  usePrintObserver(main);

  // Output landed in the transcript at the end of the page: go there.
  // Runs after the new entry has committed, so the scroll reaches it.
  useEffect(() => {
    if (!outputTick) return;
    switchTo("transcript", { focus: false });
    const id = requestAnimationFrame(() => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [outputTick, switchTo]);

  // Keyboard: "/" focuses the prompt like a search box would.
  useEffect(() => {
    function onKey(e) {
      if (e.key === "/" && !/input|textarea/i.test(e.target.tagName)) {
        e.preventDefault();
        document.getElementById(PROMPT_INPUT_ID)?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={styles.app}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <StatusBar current={current} run={shell.run} theme={theme} cycleTheme={cycle} deploy={deploy} />

      <main id="main" ref={main} className={styles.main}>
        <Login phase={loginPhase} setPhase={setLoginPhase} run={shell.run} deploy={deploy} />

        <Bridge steps={BRIDGES.experience} />
        <Section
          id="experience"
          title="Experience"
          command={findSection("experience").command}
          onRun={shell.run}
          lead="Employers as applications. Current roles are active; the rest ran their course. Select an app for details."
        >
          <Experience />
        </Section>

        <Bridge steps={BRIDGES.projects} />
        <Section
          id="projects"
          title="Projects"
          command={findSection("projects").command}
          onRun={shell.run}
          lead="Shipped work, expressed as the plan that would build it."
        >
          <Projects />
        </Section>

        <Bridge steps={BRIDGES.skills} />
        <Section
          id="skills"
          title="Skills"
          command={findSection("skills").command}
          onRun={shell.run}
          lead="The pipeline that builds everything else. Select a job to see where it ran."
        >
          <Skills />
        </Section>

        <Bridge steps={BRIDGES.contact} />
        <Section id="contact" title="Contact" command={findSection("contact").command} onRun={shell.run} lead="Everything is exposed. Pick a channel.">
          <Contact />
        </Section>

        <Bridge steps={BRIDGES.transcript} />
        <Transcript history={shell.history} />

        <footer className={styles.footer}>
          <p>
            Designed and developed by {PROFILE.name}. Build <code>{__BUILD_SHA__}</code>.
          </p>
        </footer>
      </main>

      <PromptLine run={shell.run} recall={shell.recall} current={current} />
    </div>
  );
}
