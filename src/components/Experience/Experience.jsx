import { useState } from "react";
import { ALL_EXPERIENCE } from "../../data/experience";
import { PROFILE } from "../../data/profile";
import styles from "./Experience.module.css";

// Experience rendered as `juju status`. The column set is the real one
// (App, Version, Status, Scale, Charm, Channel, Message) with Message —
// where juju puts human-readable status text — carrying the role title.
//
// Markup is a real <table> with explicit ARIA roles so the semantics
// survive the CSS that turns rows into stacked cards on narrow screens.
// Each row expands (button, aria-expanded) into details.

const STATUS_LABEL = {
  active: "active",
  terminated: "terminated",
  volunteer: "volunteer",
};

function version(period) {
  const y = (s) => (s ? s.slice(0, 4) : null);
  const start = y(period.start);
  const end = y(period.end);
  if (!start && !end) return "—";
  if (!end) return `${start}–`;
  if (!start) return end;
  return start === end ? start : `${start}–${end}`;
}

function StatusCell({ status }) {
  return (
    <span className={`${styles.status} ${styles[`status_${status}`] ?? ""}`}>
      <span className={styles.dot} aria-hidden="true" />
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function Row({ role, open, onToggle }) {
  const detailsId = `exp-${role.app}-details`;
  const hasDetails = role.details.length > 0 || role.cloud.length > 0;

  return (
    <>
      <tr role="row" className={`${styles.row} ${open ? styles.rowOpen : ""}`}>
        <td role="cell" className={styles.cellApp} data-label="App">
          <button
            type="button"
            className={styles.appBtn}
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={detailsId}
          >
            <span className={styles.chevron} aria-hidden="true">
              {open ? "▾" : "▸"}
            </span>
            <span className={styles.app}>{role.app}</span>
          </button>
        </td>
        <td role="cell" className={`${styles.cell} tnum`} data-label="Version">
          {version(role.period)}
        </td>
        <td role="cell" className={styles.cell} data-label="Status">
          <StatusCell status={role.status} />
        </td>
        <td role="cell" className={`${styles.cell} ${styles.cellScale} tnum`} data-label="Scale">
          1
        </td>
        <td role="cell" className={styles.cell} data-label="Charm">
          {role.charm}
        </td>
        <td role="cell" className={`${styles.cell} ${styles.cellChannel}`} data-label="Channel">
          {role.channel ?? "—"}
        </td>
        <td role="cell" className={`${styles.cell} ${styles.cellMessage}`} data-label="Message">
          <span className={styles.message}>{role.role}</span>
          <span className={styles.messageSub}> · {role.type}</span>
        </td>
      </tr>
      <tr role="row" className={styles.detailsRow} id={detailsId} hidden={!open}>
        <td role="cell" colSpan={7} className={styles.detailsCell}>
          <div className={styles.details}>
            <div className={styles.detailsHead}>
              <a className={styles.company} href={role.href} target="_blank" rel="noreferrer noopener">
                {role.logo ? (
                  <span className={`${styles.logoBox} ${role.logo.needsCanvas ? styles.logoCanvas : ""}`}>
                    <img
                      className={styles.logo}
                      src={role.logo.src}
                      alt=""
                      width={role.logo.width}
                      height={role.logo.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                ) : null}
                <span className={styles.companyName}>
                  {role.company}
                  <span className={styles.ext} aria-hidden="true">
                    {" "}
                    ↗
                  </span>
                </span>
              </a>
              {role.cloud.length ? (
                <ul className={styles.chips} aria-label="Platforms and tools">
                  {role.cloud.map((c) => (
                    <li key={c} className={styles.chip}>
                      {c}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            {role.details.length ? (
              <ul className={styles.bullets}>
                {role.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.noDetails}>{hasDetails ? "" : "No further details."}</p>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}

export default function Experience() {
  const [openApp, setOpenApp] = useState(null);
  const counts = ALL_EXPERIENCE.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {});

  return (
    <div className={styles.wrap}>
      <div className={styles.modelHeader} aria-label="Model">
        <div className={styles.modelRow}>
          <span className={styles.k}>Model</span>
          <span className={styles.k}>Controller</span>
          <span className={styles.k}>Cloud/Region</span>
          <span className={styles.k}>Version</span>
          <span className={styles.k}>Timestamp</span>
        </div>
        <div className={styles.modelRow}>
          <span>{PROFILE.handle}</span>
          <span>experience</span>
          <span>microk8s/localhost</span>
          <span className="tnum">3.6.4</span>
          <span>now</span>
        </div>
      </div>

      <div className={styles.tableScroll} role="region" aria-label="Status table" tabIndex={0}>
        <table role="table" className={styles.table}>
          <caption className="sr-only">
            Work experience, {counts.active ?? 0} current, {counts.terminated ?? 0} previous, {counts.volunteer ?? 0} volunteer.
            Activate an application name to show details.
          </caption>
          <thead role="rowgroup">
            <tr role="row" className={styles.head}>
              <th role="columnheader" scope="col">App</th>
              <th role="columnheader" scope="col">Version</th>
              <th role="columnheader" scope="col">Status</th>
              <th role="columnheader" scope="col" className={styles.cellScale}>Scale</th>
              <th role="columnheader" scope="col">Charm</th>
              <th role="columnheader" scope="col" className={styles.cellChannel}>Channel</th>
              <th role="columnheader" scope="col">Message</th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {ALL_EXPERIENCE.map((role) => (
              <Row key={role.app} role={role} open={openApp === role.app} onToggle={() => setOpenApp(openApp === role.app ? null : role.app)} />
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.footnote}>
        <span className={styles.dotInline} aria-hidden="true" /> {counts.active ?? 0} active ·{" "}
        {counts.terminated ?? 0} terminated · {counts.volunteer ?? 0} volunteer
      </p>
    </div>
  );
}
