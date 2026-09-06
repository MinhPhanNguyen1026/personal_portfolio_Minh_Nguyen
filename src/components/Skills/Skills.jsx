import { useState } from "react";
import { PIPELINE } from "../../data/skills";
import { ALL_EXPERIENCE } from "../../data/experience";
import { PROJECTS } from "../../data/projects";
import styles from "./Skills.module.css";

// Skills as a CI pipeline: stages left to right, jobs as green checks.
// A job that lists where it was used is a button; activating it reveals
// that list. A "running" job is one being actively learned — honest,
// and yellow.

/* global __BUILD_SHA__ */
const RUN_ID = typeof __BUILD_SHA__ === "string" ? __BUILD_SHA__ : "local";

const NAMES = Object.fromEntries([
  ...ALL_EXPERIENCE.map((r) => [r.app, r.company]),
  ...PROJECTS.map((p) => [p.id, p.title]),
]);

function Job({ job, open, onToggle }) {
  const running = job.state === "running";
  const used = job.usedAt.map((k) => NAMES[k] ?? k);
  const interactive = used.length > 0;
  const id = `job-${job.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;

  const inner = (
    <>
      <span className={`${styles.tick} ${running ? styles.tickRunning : ""}`} aria-hidden="true">
        {running ? "›" : "✓"}
      </span>
      <span className={styles.jobName}>{job.name}</span>
      {running ? <span className={styles.jobState}>learning</span> : null}
      {interactive ? (
        <span className={styles.count} aria-hidden="true">
          {used.length}
        </span>
      ) : null}
    </>
  );

  return (
    <li className={styles.jobItem}>
      {interactive ? (
        <button
          type="button"
          className={`${styles.job} ${open ? styles.jobOpen : ""}`}
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
        >
          {inner}
        </button>
      ) : (
        <span className={`${styles.job} ${styles.jobStatic}`}>{inner}</span>
      )}
      {interactive ? (
        <div id={id} className={styles.usedAt} hidden={!open}>
          <span className={styles.usedLabel}>used at</span>
          <ul className={styles.usedList}>
            {used.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

export default function Skills() {
  const [open, setOpen] = useState(null);
  const total = PIPELINE.reduce((n, s) => n + s.jobs.length, 0);
  const running = PIPELINE.reduce((n, s) => n + s.jobs.filter((j) => j.state === "running").length, 0);

  return (
    <div className={styles.wrap}>
      <div className={styles.runHeader} data-print>
        <span className={styles.runDot} aria-hidden="true" />
        <span className={styles.runName}>build-minh</span>
        <span className={styles.runMeta}>
          <span className={styles.ok}>✓ {total - running} passed</span>
          {running ? (
            <>
              {" · "}
              <span className={styles.warn}>› {running} running</span>
            </>
          ) : null}
          {" · "}#{RUN_ID}
        </span>
      </div>

      <ol className={styles.pipeline} aria-label="Skills by stage">
        {PIPELINE.map((stage) => (
          <li key={stage.stage} className={styles.stage} data-print>
            <h3 className={styles.stageTitle}>{stage.stage}</h3>
            <ul className={styles.jobs} aria-label={`${stage.stage} jobs`}>
              {stage.jobs.map((job) => (
                <Job key={job.name} job={job} open={open === job.name} onToggle={() => setOpen(open === job.name ? null : job.name)} />
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
