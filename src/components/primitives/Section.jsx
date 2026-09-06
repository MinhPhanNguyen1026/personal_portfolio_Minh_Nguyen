import { useState } from "react";
import CommandBox from "./CommandBox";
import styles from "./Section.module.css";

// Every content section is one transcript entry: the command that
// produces it (typed on scroll, with copy and run), then its output —
// the section body, which "prints" when the command finishes typing.
// The h2 receives focus after `juju switch`.

export default function Section({ id, title, command, onRun, lead, children, className = "" }) {
  const headingId = `${id}-title`;
  // Incremented each time the command finishes typing; the key restarts
  // the print animation on a replay.
  const [printed, setPrinted] = useState(0);

  return (
    <section id={id} className={`${styles.section} ${className}`} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <header className={styles.head}>
          {command ? <CommandBox command={command} onRun={onRun} onTyped={() => setPrinted((n) => n + 1)} /> : null}
          <div key={printed} className={printed ? styles.print : undefined}>
            <h2 id={headingId} className={styles.title} tabIndex={-1} data-section-heading>
              {title}
            </h2>
            {lead ? <p className={styles.lead}>{lead}</p> : null}
          </div>
        </header>
        <div key={`body-${printed}`} className={`${styles.body} ${printed ? styles.print : ""}`}>
          {children}
        </div>
      </div>
    </section>
  );
}
