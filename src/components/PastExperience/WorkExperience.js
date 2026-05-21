import React from "react";
import styles from "./WorkExperience.module.css";

// If you want to include past roles too, just add to this array.
const EMPLOYERS = [
  {
    company: "Canonical",
    role: "Software Engineer",
    href: "https://canonical.com/",
    logo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/9/93/Canonical_logo_2023.svg",
      width: 1329,
      height: 400,
      needsInvertOnLight: false,
    },
  },
  {
    company: "Inter.play Lab",
    role: "Research Assistant",
    href: "https://interplaylab.com/",
    logo: {
      src: "https://interplaylab.com/wp-content/uploads/2025/09/Logo_v1.0-1.png",
      width: 874,
      height: 874,
      needsInvertOnLight: false,
      needsCanvas: true,
    },
  },
  {
    company: "Onc.AI",
    role: "Software Engineer (Contract)",
    href: "https://onc.ai/",
    // White wordmark from Onc.AI site (better inverted on light backgrounds)
    logo: {
      src: "https://onc.ai/wp-content/uploads/2021/11/oncai_logo_updated-color-2.png",
      width: 304,
      height: 90,
      needsInvertOnLight: false,
    },
  },
  {
    company: "University of Rochester",
    role: "Technical Assistant II",
    href: "https://www.rochester.edu/",
    // Official wordmark+shield as SVG (Wikipedia-hosted file)
    logo: {
      src: "https://upload.wikimedia.org/wikipedia/en/7/76/University_of_Rochester_logo.svg",
      width: 690,
      height: 190,
      needsInvertOnLight: false,
    },
  },
  // Uncomment to show a past role as well
  {
    company: "Salesforce",
    role: "Software Engineer Intern",
    href: "https://www.salesforce.com/",
    logo: {
      src: "https://a.sfdcstatic.com/shared/images/c360-nav/salesforce-with-type-logo.svg",
      width: 512,
      height: 160,
      needsInvertOnLight: false,
    },
  },
{
    company: "ROC-HCI Lab",
    role: "Research Assistant",
    href: "https://roc-hci.com/",
    logo: {
      src: "https://roc-hci.com/wp-content/uploads/vertical_logo-1-e1528565825525.png",
      width: 690,
      height: 190,
      needsInvertOnLight: false,
    },
  },
  {
// https://sb-web-assets.s3.amazonaws.com/production/2877/PwC_fl_c.png
    company: "PwC",
    role: "Digital Transformation Consultant",
    href: "https://www.pwc.com/vn/en",
    logo: {
      src: "https://sb-web-assets.s3.amazonaws.com/production/2877/PwC_fl_c.png",
      width: 690,
      height: 190,
      needsInvertOnLight: false,
    },
  },
];

export default function WorkAffiliations() {
  return (
    <section className={styles.wrap} aria-labelledby="affiliations-title">
      <div className={styles.titleRow}>
        <h2 id="affiliations-title" className={styles.title}>
          Where I <span className={styles.titleAccent}>Work</span>
        </h2>
        <div className={styles.titleUnderline} aria-hidden="true" />
      </div>

      <ul className={styles.grid} role="list">
        {EMPLOYERS.map((e) => (
          <li key={e.company} className={styles.item}>
            <a className={`${styles.tile} ${e.logo.needsBlend ? styles.tileBlend : ""} ${e.logo.needsCanvas ? styles.tileCanvas : ""}`} href={e.href} target="_blank" rel="noreferrer noopener" aria-label={`${e.company} — ${e.role}`}>
              <div className={styles.logoBox}>
                <img
                  className={`${styles.logo} ${e.logo.needsInvertOnLight ? styles.needsInvert : ""} ${e.logo.needsBlend ? styles.needsBlend : ""} ${e.logo.needsCanvas ? styles.logoCanvas : ""}`}
                  src={e.logo.src}
                  alt={`${e.company} logo`}
                  loading="lazy"
                  decoding="async"
                  width={e.logo.width}
                  height={e.logo.height}
                />
              </div>
              {/* <figcaption className={styles.caption}> */}
                {/* <span className={styles.company}>{e.company}</span>
                <span className={styles.separator} aria-hidden>•</span> */}
                {/* <span className={styles.role}>{e.role}</span> */}
              {/* </figcaption> */}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
