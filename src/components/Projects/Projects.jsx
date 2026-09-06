import { PROJECTS } from "../../data/projects";
import styles from "./Projects.module.css";

import project1 from "../../assets/projects/project1.webp";
import project3 from "../../assets/projects/project3.webp";
import project4 from "../../assets/projects/project4.webp";

// Projects as `terraform plan` output. Each project is a resource block
// rendered from its attrs with keys padded so `=` aligns, the way
// `terraform fmt` would — then the screenshot, summary, and links.

const IMAGES = { project1, project3, project4 };

// Lists render one item per line with trailing commas — what
// `terraform fmt` does — which also keeps long stacks from overflowing.
function Value({ value }) {
  if (Array.isArray(value)) {
    return (
      <>
        <span className={styles.punct}>[</span>
        {"\n"}
        {value.map((v) => (
          <span key={v}>
            {"        "}
            <span className={styles.str}>"{v}"</span>
            <span className={styles.punct}>,</span>
            {"\n"}
          </span>
        ))}
        {"      "}
        <span className={styles.punct}>]</span>
      </>
    );
  }
  if (typeof value === "number") return <span className={styles.num}>{value}</span>;
  return <span className={styles.str}>"{value}"</span>;
}

function HclBlock({ project }) {
  const width = Math.max(...project.attrs.map(([k]) => k.length));
  return (
    // tabIndex: the block can scroll sideways on narrow screens, so it must
    // be reachable from the keyboard.
    <pre className={styles.hcl} tabIndex={0} aria-label={`Terraform resource for ${project.title}`}>
      <span className={styles.comment}>
        # module.projects.{project.type}.{project.id} will be created
      </span>
      {"\n"}
      <span className={styles.add}>+</span> <span className={styles.kw}>resource</span>{" "}
      <span className={styles.type}>"{project.type}"</span> <span className={styles.str}>"{project.id}"</span>{" "}
      <span className={styles.punct}>{"{"}</span>
      {"\n"}
      {project.attrs.map(([k, v]) => (
        <span key={k} className={styles.attr}>
          {"    "}
          <span className={styles.add}>+</span> <span className={styles.key}>{k.padEnd(width)}</span> <span className={styles.punct}>=</span>{" "}
          <Value value={v} />
          {"\n"}
        </span>
      ))}
      {"  "}
      <span className={styles.punct}>{"}"}</span>
    </pre>
  );
}

function ProjectLink({ link }) {
  if (!link.href) {
    return (
      <span className={`${styles.link} ${styles.linkDisabled}`} aria-disabled="true" title="Source is confidential">
        <span className={styles.lock} aria-hidden="true">
          ⌀
        </span>{" "}
        {link.label} <span className={styles.linkSub}>· confidential</span>
      </span>
    );
  }
  return (
    <a className={styles.link} href={link.href} target="_blank" rel="noreferrer noopener">
      {link.label}
      <span className={styles.ext} aria-hidden="true">
        {" "}
        ↗
      </span>
    </a>
  );
}

export default function Projects() {
  return (
    <div className={styles.wrap}>
      <p className={styles.preamble} data-print>
        Terraform will perform the following actions:
      </p>

      <ul className={styles.list}>
        {PROJECTS.map((p) => (
          <li key={p.id} className={styles.item} data-print>
            <article className={styles.card} aria-labelledby={`proj-${p.id}`}>
              <div className={styles.code}>
                <HclBlock project={p} />
              </div>
              <div className={styles.body}>
                <figure className={styles.figure}>
                  <img className={styles.image} src={IMAGES[p.image]} alt={p.alt} loading="lazy" decoding="async" />
                </figure>
                <div className={styles.text}>
                  <h3 id={`proj-${p.id}`} className={styles.title}>
                    {p.title}
                  </h3>
                  <p className={styles.summary}>{p.summary}</p>
                  <ul className={styles.links} aria-label={`${p.title} links`}>
                    {p.links.map((l) => (
                      <li key={l.label}>
                        <ProjectLink link={l} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <p className={styles.summaryLine} data-print>
        Plan: <span className={styles.add}>{PROJECTS.length} to add</span>, 0 to change, 0 to destroy.
      </p>
    </div>
  );
}
