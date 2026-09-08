import { useRef, useState } from "react";
import CommandBox, { canAnimate } from "./CommandBox";
import { useStartWhenVisible } from "../../hooks/useStartWhenVisible";
import styles from "./Section.module.css";

// One transcript entry: the prompt line that produces this section, a
// `# comment` heading, then the output. Output units (anything with
// data-print) stay unwritten until the command has finished typing —
// data-ready flips to "true" — and then print as they scroll into view.
// Scrolling back up past the prompt un-types it and the output waits
// again. If the output reaches the viewport before the prompt was seen
// (fast scroll), the section starts the typing itself.

export default function Section({ id, title, command, onRun, lead, children, className = "" }) {
  const headingId = `${id}-title`;
  const box = useRef(null);
  const body = useRef(null);
  const [ready, setReady] = useState(() => !command || !canAnimate());
  useStartWhenVisible(body, box);

  return (
    <section id={id} className={`${styles.section} ${className}`} aria-labelledby={headingId} data-ready={ready ? "true" : "false"}>
      <div className={styles.inner}>
        <header className={styles.head}>
          {command ? (
            <CommandBox ref={box} command={command} onRun={onRun} onTyped={() => setReady(true)} onReset={() => setReady(false)} />
          ) : null}
          <div className={styles.comment} data-print>
            <h2 id={headingId} className={styles.title} tabIndex={-1} data-section-heading>
              <span className={styles.hash} aria-hidden="true">
                #
              </span>
              {title}
            </h2>
            {lead ? <p className={styles.lead}>{lead}</p> : null}
          </div>
        </header>
        <div ref={body} className={styles.body}>
          {children}
        </div>
      </div>
    </section>
  );
}
