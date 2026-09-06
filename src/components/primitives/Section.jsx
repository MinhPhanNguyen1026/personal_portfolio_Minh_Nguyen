import CommandBox from "./CommandBox";
import styles from "./Section.module.css";

// Every content section: the command that produces this view (with copy
// and run), an h2 that receives focus after `juju switch`, and an
// optional lead.

export default function Section({ id, title, command, onRun, lead, children, className = "" }) {
  const headingId = `${id}-title`;
  return (
    <section id={id} className={`${styles.section} ${className}`} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <header className={styles.head}>
          {command ? <CommandBox command={command} onRun={onRun} /> : null}
          <h2 id={headingId} className={styles.title} tabIndex={-1} data-section-heading>
            {title}
          </h2>
          {lead ? <p className={styles.lead}>{lead}</p> : null}
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}
