import Section from "../primitives/Section";
import styles from "./Transcript.module.css";

// The tail of the transcript: every command typed at the prompt and its
// output, oldest first. It is an aria-live log so screen readers hear
// new output without moving focus.

export default function Transcript({ history }) {
  return (
    <Section id="transcript" title="Transcript" lead="Everything you run lands here. Type at the prompt below, or press / to jump to it.">
      <div className={styles.log} role="log" aria-live="polite" aria-relevant="additions" aria-label="Terminal output">
        {history.length === 0 ? (
          <p className={styles.hint}>
            Nothing yet. Try <code>help</code>, <code>juju status</code>, or <code>theme light</code>.
          </p>
        ) : null}
        {history.map((entry) => (
          <div key={entry.id} className={styles.entry}>
            <div className={styles.cmdLine}>
              <span className={styles.p} aria-hidden="true">
                $
              </span>
              <span className="sr-only">Command: </span>
              <span className={styles.cmd}>{entry.cmd}</span>
            </div>
            {entry.lines.map((l, i) => (
              <div key={i} className={`${styles.line} ${styles[l.kind] ?? ""}`}>
                {l.text || " "}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}
