import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { PROFILE } from "../../data/profile";
import styles from "./CommandBox.module.css";

// A prompt line in the transcript: `minh@portfolio:~$ <command>`, with
// copy and run. Every command shown this way is implemented in the
// engine, so "run" does exactly what typing it would.
//
// The command types itself the first time it scrolls into view, then
// calls onTyped so its output can print. A parent can also call
// ref.start() — a section does this when its output comes into view
// before the prompt has been seen (fast scrolling), so output is never
// stuck waiting. "run" retypes quickly before running — a replay.
// Under prefers-reduced-motion, or without IntersectionObserver, nothing
// animates. The full command is always in the accessible name; the
// animated text is presentational.

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

const CommandBox = forwardRef(function CommandBox({ command, onRun, onTyped, active = true, label }, ref) {
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
    [command, clearTimers]
  );

  const start = useCallback(() => {
    if (started.current) return;
    started.current = true;
    type();
  }, [type]);

  useImperativeHandle(ref, () => ({ start }), [start]);

  useEffect(() => {
    if (started.current || !active || !box.current) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        start();
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(box.current);
    return () => io.disconnect();
  }, [active, start]);

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
    <div ref={box} className={styles.line} role="group" aria-label={label ?? `Command: ${command}`}>
      <span className={styles.prompt} aria-hidden="true">
        <span className={styles.host}>
          {PROFILE.handle}@{PROFILE.host}
        </span>
        <span className={styles.path}>:~</span>$
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
});

export default CommandBox;
