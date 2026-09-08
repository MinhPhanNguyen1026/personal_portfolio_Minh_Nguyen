import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { PROFILE } from "../../data/profile";
import styles from "./CommandBox.module.css";

// A prompt line in the transcript: `minh@portfolio:~$ <command>`, with
// copy and run. Every command shown this way is implemented in the
// engine, so "run" does exactly what typing it would. `quiet` renders a
// muted, non-interactive line for the bridges between sections.
//
// The command types itself when it scrolls into view, then calls
// onTyped so its output can print. If it later leaves through the bottom
// of the viewport (the reader scrolled back up), it un-types and calls
// onReset, so it types again on the way down. A parent can also call
// ref.start() — a section does this when its output comes into view
// before the prompt has been seen (fast scrolling). "run" retypes
// quickly before running — a replay. Under prefers-reduced-motion, or
// without IntersectionObserver, nothing animates. The full command is
// always in the accessible name; the animated text is presentational.

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export const canAnimate = () => typeof IntersectionObserver !== "undefined" && !prefersReducedMotion();

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

const CommandBox = forwardRef(function CommandBox({ command, onRun, onTyped, onReset, active = true, quiet = false, label }, ref) {
  const animate = canAnimate();
  const [typed, setTyped] = useState(animate ? "" : command);
  const [typing, setTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const box = useRef(null);
  const timers = useRef([]);
  const started = useRef(!animate);
  const copyTimer = useRef(null);
  const onTypedRef = useRef(onTyped);
  const onResetRef = useRef(onReset);
  onTypedRef.current = onTyped;
  onResetRef.current = onReset;

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
      const perChar = Math.min(quiet ? 26 : 38, 700 / command.length);
      for (let i = 1; i <= command.length; i++) {
        timers.current.push(setTimeout(() => setTyped(command.slice(0, i)), 100 + i * perChar));
      }
      timers.current.push(
        setTimeout(() => {
          setTyping(false);
          onTypedRef.current?.();
          onEnd?.();
        }, 100 + command.length * perChar + 140)
      );
    },
    [command, quiet, clearTimers]
  );

  const start = useCallback(() => {
    if (started.current) return;
    started.current = true;
    type();
  }, [type]);

  const reset = useCallback(() => {
    if (!started.current) return;
    started.current = false;
    clearTimers();
    setTyped("");
    setTyping(false);
    onResetRef.current?.();
  }, [clearTimers]);

  useImperativeHandle(ref, () => ({ start, reset }), [start, reset]);

  useEffect(() => {
    if (!animate || !active || !box.current) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
        } else if (entry.boundingClientRect.top >= (entry.rootBounds?.bottom ?? window.innerHeight)) {
          reset();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(box.current);
    return () => io.disconnect();
  }, [animate, active, start, reset]);

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

  const showCaret = typing || (animate && !typed);

  if (quiet) {
    return (
      <div ref={box} className={`${styles.line} ${styles.quiet}`}>
        <span className={styles.prompt} aria-hidden="true">
          $
        </span>
        <code className={styles.cmd} aria-hidden="true">
          {typed}
          {showCaret ? <span className={`${styles.caret} ${typing ? styles.caretSolid : ""}`} /> : null}
        </code>
        <span className="sr-only">{command}</span>
      </div>
    );
  }

  return (
    <div ref={box} className={styles.line} role="group" aria-label={label ?? `Command: ${command}`}>
      <span className={styles.prompt} aria-hidden="true">
        <span className={styles.host}>
          {PROFILE.handle}@{PROFILE.host}
        </span>
        <span className={styles.path}>:~</span>$
      </span>
      <code className={styles.cmd} aria-hidden="true">
        {typed}
        {showCaret ? <span className={`${styles.caret} ${typing ? styles.caretSolid : ""}`} /> : null}
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
});

export default CommandBox;
