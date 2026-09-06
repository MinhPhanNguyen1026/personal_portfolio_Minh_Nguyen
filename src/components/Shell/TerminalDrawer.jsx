import { useEffect, useRef, useState } from "react";
import { PROFILE } from "../../data/profile";
import styles from "./TerminalDrawer.module.css";

// Docked at the bottom. Collapsed: a one-line bar showing the last
// command. Expanded: the transcript (an aria-live log) and an input.
// Both paths — clicking a nav button or typing here — go through run().

const PROMPT = `${PROFILE.handle}@${PROFILE.host}`;

export default function TerminalDrawer({ history, run, recall, current, open, setOpen }) {
  const [value, setValue] = useState("");
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const last = history[history.length - 1];

  // Keep the newest output in view.
  useEffect(() => {
    if (open && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [history, open]);

  function onKeyDown(e) {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setValue(recall(-1));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setValue(recall(1));
    } else if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  }

  return (
    <aside
      id="terminal-drawer"
      className={`${styles.drawer} ${open ? styles.open : ""}`}
      aria-label="Terminal"
    >
      <div className={styles.bar}>
        <span className={styles.lights} aria-hidden="true">
          <i /><i /><i />
        </span>
        <span className={styles.title}>{PROMPT} · bash</span>
        {!open && last ? (
          <span className={styles.peek} aria-hidden="true">
            <span className={styles.p}>$</span> {last.cmd}
          </span>
        ) : null}
        <span className={styles.cwd} aria-hidden="true">~/controllers/{current}</span>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="terminal-body"
        >
          {open ? "▾ collapse" : "▴ expand"}
        </button>
      </div>

      <div id="terminal-body" className={styles.body} hidden={!open}>
        <div ref={logRef} className={styles.log} role="log" aria-live="polite" aria-relevant="additions">
          {history.length === 0 ? (
            <p className={styles.hint}>
              Click any section above, or type <code>help</code>.
            </p>
          ) : null}
          {history.map((entry) => (
            <div key={entry.id} className={styles.entry}>
              <div className={styles.cmdLine}>
                <span className={styles.p} aria-hidden="true">$</span>
                <span className="sr-only">Command: </span>
                <span className={styles.cmd}>{entry.cmd}</span>
              </div>
              {entry.lines.map((l, i) => (
                <div key={i} className={`${styles.line} ${styles[l.kind] ?? ""}`}>
                  {l.text || " "}
                </div>
              ))}
            </div>
          ))}
        </div>

        <label className={styles.inputRow}>
          <span className={styles.p} aria-hidden="true">$</span>
          <span className="sr-only">Command input</span>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="juju switch projects"
          />
        </label>
      </div>
    </aside>
  );
}
