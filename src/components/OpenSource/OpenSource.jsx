import { OPEN_SOURCE } from "../../data/opensource";
import { useRepoStats } from "../../hooks/useRepoStats";
import styles from "./OpenSource.module.css";

// Open-source work rendered like `gh repo view`: owner/repo with a live
// star count and language, what the project is and why it matters, then
// what Minh contributed and the merged PRs as links.

function Stars({ n }) {
  return (
    <span className={styles.stars}>
      <span aria-hidden="true">★</span>
      <span className="sr-only">Stars:</span> {n.toLocaleString()}
    </span>
  );
}

export default function OpenSource() {
  const stats = useRepoStats(OPEN_SOURCE);

  return (
    <div className={styles.wrap}>
      <p className={styles.preamble} data-print>
        Showing {OPEN_SOURCE.length} repositories in canonical
      </p>

      <ul className={styles.list}>
        {OPEN_SOURCE.map((r) => {
          const s = stats[r.fullName];
          return (
            <li key={r.fullName} className={styles.repo} data-print>
              <article aria-labelledby={`oss-${r.fullName.replace(/\W+/g, "-")}`}>
                <header className={styles.head}>
                  <a id={`oss-${r.fullName.replace(/\W+/g, "-")}`} className={styles.fullName} href={r.url} target="_blank" rel="noreferrer noopener">
                    <span className={styles.owner}>{r.fullName.split("/")[0]}/</span>
                    <span className={styles.name}>{r.fullName.split("/")[1]}</span>
                    <span className={styles.ext} aria-hidden="true">
                      {" "}
                      ↗
                    </span>
                  </a>
                  <span className={styles.meta}>
                    <Stars n={s.stars} />
                    <span className={styles.lang}>
                      <span className={`${styles.langDot} ${styles[`lang_${s.language}`] ?? ""}`} aria-hidden="true" />
                      {s.language}
                    </span>
                    <span className={styles.role}>contributor</span>
                  </span>
                </header>

                <p className={styles.what}>{r.what}</p>
                <p className={styles.why}>{r.why}</p>

                {r.contributions.length ? (
                  <ul className={styles.bullets} aria-label={`Contributions to ${r.name}`}>
                    {r.contributions.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                ) : null}

                <div className={styles.foot}>
                  <ul className={styles.tags} aria-label="Topics">
                    {r.tags.map((t) => (
                      <li key={t} className={styles.tag}>
                        {t}
                      </li>
                    ))}
                  </ul>
                  {r.highlights.length ? (
                    <ul className={styles.prs} aria-label={`Highlights in ${r.name}`}>
                      {r.highlights.map((h) => (
                        <li key={h.url}>
                          <a className={styles.pr} href={h.url} target="_blank" rel="noreferrer noopener">
                            <span className={styles.prNum}>{h.kind === "pr" ? "PR" : "commit"}</span> {h.label}
                            <span className={styles.ext} aria-hidden="true">
                              {" "}
                              ↗
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
