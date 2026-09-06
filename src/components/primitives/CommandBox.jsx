import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./CommandBox.module.css";

// A command shown above a section, styled like a markdown code block:
// prompt, the command, and copy / run buttons. Every command shown this
// way is implemented in the engine, so "run" does exactly what typing
// it would.
//
// The command types itself the first time it scrolls into view, then
// calls onTyped so the section can "print". "run" retypes it quickly
// before running — a replay. Under prefers-reduced-motion, or without
// IntersectionObserver, nothing animates and the text is simply there.
// The full command is always in the accessible name; the animated text
// is presentational.

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

const canAnimate = () => typeof IntersectionObserver !== "undefined" && !prefersReducedMotion();

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let done = false;
  try {
    done = document.execCommand("copy");
  } finally {
    ta.remove();
  }
  return done;
}

export default function CommandBox({ command, onRun, onTyped, active = true, label }) {
  const animate = canAnimate();
  const [typed, setTyped] = useState(animate ? "" : command);
  const [typing, setTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const box = useRef(null);
  const timers = useRef([]);
  const started = useRef(!animate);
  const copyTimer = useRef(null);
  const onTypedRef = useRef(onTyped);
  onTypedRef.current = onTyped;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  // ~35ms per character, but never longer than ~0.7s for a long command.
  const type = useCallback(
    (onEnd) => {
      clearTimers();
      setTyped("");
      setTyping(true);
      const perChar = Math.min(38, 700 / command.length);
      for (let i = 1; i <= command.length; i++) {
        timers.current.push(setTimeout(() => setTyped(command.slice(0, i)), 120 + i * perChar));
      }
      timers.current.push(
        setTimeout(() => {
          setTyping(false);
          onTypedRef.current?.();
          onEnd?.();
        }, 120 + command.length * perChar + 160)
      );
    },
    [command, clearTimers]
  );

  useEffect(() => {
    if (started.current || !active || !box.current) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        started.current = true;
        io.disconnect();
        type();
      },
      { threshold: 0.6 }
    );
    io.observe(box.current);
    return () => io.disconnect();
  }, [active, type]);

  useEffect(
    () => () => {
      clearTimers();
      clearTimeout(copyTimer.current);
    },
    [clearTimers]
  );

  function run() {
    if (!animate) {
      onRun?.(command);
      return;
    }
    started.current = true;
    type(() => onRun?.(command));
  }

  async function copy() {
    let done = false;
    try {
      done = await copyText(command);
    } catch {
      done = false;
    }
    setCopied(done);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div ref={box} className={styles.box} role="group" aria-label={label ?? `Command: ${command}`}>
      <span className={styles.prompt} aria-hidden="true">
        $
      </span>
      <code className={styles.cmd} aria-hidden="true">
        {typed}
        {typing || (animate && !typed) ? <span className={`${styles.caret} ${typing ? styles.caretSolid : ""}`} /> : null}
      </code>
      <span className="sr-only">{command}</span>
      <div className={styles.actions}>
        <button type="button" className={`${styles.btn} ${copied ? styles.btnDone : ""}`} onClick={copy} aria-label={`Copy "${command}"`}>
          <span aria-hidden="true">{copied ? "✓ copied" : "copy"}</span>
        </button>
        {onRun ? (
          <button type="button" className={`${styles.btn} ${styles.btnRun}`} onClick={run} aria-label={`Run "${command}"`}>
            <span aria-hidden="true">run ▸</span>
          </button>
        ) : null}
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard." : ""}
      </span>
    </div>
  );
}
