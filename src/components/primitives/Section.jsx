import styles from "./Section.module.css";

// Every content section: a mono eyebrow that names the controller, an
// h2 that receives focus after `juju switch`, and an optional lead.

export default function Section({ id, title, eyebrow, lead, children, className = "" }) {
  const headingId = `${id}-title`;
  return (
    <section id={id} className={`${styles.section} ${className}`} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.eyebrow} aria-hidden="true">
            <span className={styles.hash}>#</span> {eyebrow ?? `controller: ${id}`}
          </p>
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
