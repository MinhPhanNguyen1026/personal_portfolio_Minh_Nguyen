import React from "react";
import styles from "./WorkExperience.module.css";

const CURRENT_ROLES = [
  {
    company: "Canonical",
    role: "Software Engineer · Full-time",
    status: "Current",
    href: "https://canonical.com/",
    logo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/9/93/Canonical_logo_2023.svg",
      width: 1329,
      height: 400,
    },
  },
  {
    company: "Inter.play Lab",
    role: "Research Assistant · Part-time",
    status: "Current",
    href: "https://interplaylab.com/",
    logo: {
      src: "https://interplaylab.com/wp-content/uploads/2025/09/Logo_v1.0-1.png",
      width: 874,
      height: 874,
      needsCanvas: true,
    },
  },
];

const PREVIOUS_EXPERIENCE = [
  {
    company: "Onc.AI",
    role: "Software Engineer · Contract",
    href: "https://onc.ai/",
    logo: {
      src: "https://onc.ai/wp-content/uploads/2021/11/oncai_logo_updated-color-2.png",
      width: 304,
      height: 90,
    },
  },
  {
    company: "University of Rochester",
    role: "Technical Assistant II",
    href: "https://www.rochester.edu/",
    logo: {
      src: "https://upload.wikimedia.org/wikipedia/en/7/76/University_of_Rochester_logo.svg",
      width: 690,
      height: 190,
    },
  },
  {
    company: "Salesforce",
    role: "Software Engineer Intern",
    href: "https://www.salesforce.com/",
    logo: {
      src: "https://a.sfdcstatic.com/shared/images/c360-nav/salesforce-with-type-logo.svg",
      width: 512,
      height: 160,
    },
  },
    {
    company: "University of Rochester",
    role: "Teaching Assistant",
    href: "https://www.rochester.edu/",
    logo: {
      src: "https://upload.wikimedia.org/wikipedia/en/7/76/University_of_Rochester_logo.svg",
      width: 690,
      height: 190,
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
    },
  },
  {
    company: "PwC",
    role: "Digital Transformation Consultant",
    href: "https://www.pwc.com/vn/en",
    logo: {
      src: "https://sb-web-assets.s3.amazonaws.com/production/2877/PwC_fl_c.png",
      width: 690,
      height: 190,
    },
  },
];

function ExperienceCard({ experience, featured = false }) {
  const tileClassName = [
    styles.tile,
    featured ? styles.featuredTile : styles.previousTile,
    experience.logo.needsBlend ? styles.tileBlend : "",
    experience.logo.needsCanvas ? styles.tileCanvas : "",
  ].join(" ");

  const logoClassName = [
    styles.logo,
    experience.logo.needsInvertOnLight ? styles.needsInvert : "",
    experience.logo.needsBlend ? styles.needsBlend : "",
    experience.logo.needsCanvas ? styles.logoCanvas : "",
  ].join(" ");

  return (
    <li className={styles.item}>
      <a
        className={tileClassName}
        href={experience.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${experience.company} — ${experience.role}`}
      >
        <div className={styles.logoBox}>
          <img
            className={logoClassName}
            src={experience.logo.src}
            alt={`${experience.company} logo`}
            loading="lazy"
            decoding="async"
            width={experience.logo.width}
            height={experience.logo.height}
          />
        </div>
        <div className={styles.caption}>
          <div className={styles.captionTop}>
            <span className={styles.company}>{experience.company}</span>
            {experience.status ? (
              <span className={styles.statusPill}>{experience.status}</span>
            ) : null}
          </div>
          <span className={styles.role}>{experience.role}</span>
        </div>
      </a>
    </li>
  );
}

export default function WorkAffiliations() {
  return (
    <section className={styles.wrap} aria-labelledby="affiliations-title">
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <span className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            Experience
          </span>
          <h2 id="affiliations-title" className={styles.title}>
            Work <span className={styles.titleAccent}>&amp; Experience</span>
          </h2>
          <div className={styles.titleUnderline} aria-hidden="true" />
        </div>

        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <h3 className={styles.groupTitle}>Where I Work Now</h3>
            <p className={styles.groupDescription}>
              Current full-time engineering and part-time research roles.
            </p>
          </div>
          <ul className={styles.currentGrid}>
            {CURRENT_ROLES.map((experience) => (
              <ExperienceCard
                key={experience.company}
                experience={experience}
                featured
              />
            ))}
          </ul>
        </div>

        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <h3 className={styles.groupTitle}>Previous Experience</h3>
            <p className={styles.groupDescription}>
              Earlier internships, research appointments, campus work, and consulting.
            </p>
          </div>
          <ul className={styles.previousGrid}>
            {PREVIOUS_EXPERIENCE.map((experience) => (
              <ExperienceCard
                key={experience.company}
                experience={experience}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
