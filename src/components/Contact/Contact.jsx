import { PROFILE } from "../../data/profile";
import styles from "./Contact.module.css";

// Contact as `juju expose contact` followed by the status of what's now
// reachable. Every row is the real link — large, keyboard-reachable.

function address(link) {
  if (link.href.startsWith("mailto:")) return link.href.slice("mailto:".length);
  if (link.href.startsWith("http")) return link.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  return link.href;
}

function href(link) {
  return /^(https?:|mailto:)/.test(link.href) ? link.href : `${import.meta.env.BASE_URL}${link.href}`;
}

export default function Contact() {
  return (
    <div className={styles.wrap}>
      <div className={styles.transcript} aria-hidden="true">
        <div>
          <span className={styles.prompt}>$</span> juju expose contact
        </div>
        <div>
          <span className={styles.prompt}>$</span> juju status contact
        </div>
      </div>

      <ul className={styles.table} aria-label="Contact channels">
        <li className={`${styles.row} ${styles.head}`} aria-hidden="true">
          <span>App</span>
          <span>Status</span>
          <span>Exposed</span>
          <span>Address</span>
        </li>
        {PROFILE.links.map((l) => (
          <li key={l.key} className={styles.item}>
            <a
              className={styles.row}
              href={href(l)}
              download={l.download}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noreferrer noopener" : undefined}
            >
              <span className={styles.app}>
                {l.key}
                <span className="sr-only">: {l.label}</span>
              </span>
              <span className={styles.status}>
                <span className={styles.dot} aria-hidden="true" />
                active
              </span>
              <span className={styles.exposed}>true</span>
              <span className={styles.address}>
                {address(l)}
                <span className={styles.glyph} aria-hidden="true">
                  {l.download ? " ↓" : l.external ? " ↗" : " ›"}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className={styles.note}>
        From interactive websites to maintainable software, I like building polished products that are clear, useful, and easy to
        keep improving. LinkedIn or email for a conversation; GitHub for the code; the resume for the short version.
      </p>
    </div>
  );
}
