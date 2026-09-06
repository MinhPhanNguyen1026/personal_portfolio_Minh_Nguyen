import { useEffect, useRef, useState } from "react";
import styles from "./CommandBox.module.css";

// A command shown above a section, styled like a markdown code block:
// prompt, the command, and copy / run buttons. Every command shown this
// way is implemented in the engine, so "run" does exactly what typing
// it would.

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  // Fallback for insecure contexts: select a hidden textarea and execCommand.
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

export default function CommandBox({ command, onRun, label }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    let done = false;
    try {
      done = await copyText(command);
    } catch {
      done = false;
    }
    setCopied(done);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className={styles.box} role="group" aria-label={label ?? `Command: ${command}`}>
      <span className={styles.prompt} aria-hidden="true">
        $
      </span>
      <code className={styles.cmd}>{command}</code>
      <div className={styles.actions}>
        <button type="button" className={`${styles.btn} ${copied ? styles.btnDone : ""}`} onClick={copy} aria-label={`Copy "${command}"`}>
          <span aria-hidden="true">{copied ? "✓ copied" : "copy"}</span>
        </button>
        {onRun ? (
          <button type="button" className={`${styles.btn} ${styles.btnRun}`} onClick={() => onRun(command)} aria-label={`Run "${command}"`}>
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
