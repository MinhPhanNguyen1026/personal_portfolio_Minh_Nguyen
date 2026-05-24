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
    company: "RocLab",
    role: "Frontend Lead",
    href: "https://linktr.ee/roclab",
    logo: {
      src: "https://ugc.production.linktr.ee/MW252fOzR3exjRUEiWn7_O7hkrL2IuY5eoVVJ?io=true&size=avatar-v3_0",
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
    role: "CS Teaching Assistant",
    href: "https://www.rochester.edu/",
    logo: {
      src: "https://upload.wikimedia.org/wikipedia/en/7/76/University_of_Rochester_logo.svg",
      width: 690,
      height: 190,
    },
  },
    {
    company: "Onc.AI",
    role: "Software Engineer Intern",
    href: "https://onc.ai/",
    logo: {
      src: "https://onc.ai/wp-content/uploads/2021/11/oncai_logo_updated-color-2.png",
      width: 304,
      height: 90,
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
    company: "Anime Interest Floor (UR)",
    role: "Web Master",
    href: "https://sonicfires2.github.io/landing-page-aif/",
    logo: {
      src: "https://sonicfires2.github.io/landing-page-aif/static/media/AIFlogo2025.d801c86c6569d6c3764e.png",
      width: 690,
      height: 190,
    },
  },
  {
    company: "PwC",
    role: "Digital Transformation Consultant · Seasonal",
    href: "https://www.pwc.com/vn/en",
    logo: {
      src: "https://sb-web-assets.s3.amazonaws.com/production/2877/PwC_fl_c.png",
      width: 690,
      height: 190,
    },
  },
];

const VOLUNTEER_EXPERIENCE = [
  {
    company: "University of Rochester",
    role: "Hackathon Organizer",
    status: "Volunteer",
    href: "https://dandyhacks.net",
    logo: {
      src: "https://scontent-sjc3-1.cdninstagram.com/v/t39.30808-6/468531939_18209114839288662_4731406689385949607_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=MzQ2MTY4NTE4NTUyMTI0NDgwNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=Yp3yC-55VtIQ7kNvwFbAM1r&_nc_oc=AdqIa04Crcj39FVR3APpmDrraeVR5vvQKnxOLvltBrid-vZXi1vZUU9P7ZaLjgYpJCA&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-sjc3-1.cdninstagram.com&_nc_gid=faX1N7cCxqZqlQWL3upORQ&_nc_ss=7a22e&oh=00_Af5zYFxkr0dw8h1x725EYN3ksUpbj6OW3YFFXkUYts-c3w&oe=6A187859",
      width: 690,
      height: 190,
    },
  },
  {
    company: "Rochester Institution of Technology",
    role: "Staff Guest Handler",
    status: "Volunteer",
    href: "https://toracon.org/home",
    logo: {
      src: "https://images.squarespace-cdn.com/content/v1/648a0ccd5f3a811d210f1d54/86546892-e74d-4973-b607-c4f338b24b67/Tora-Con+2026+Logo+%28w_+anime%29.png?format=1500w",
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
            <div className={styles.company}>{experience.company}</div>
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

        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <h3 className={styles.groupTitle}>Volunteer</h3>
            <p className={styles.groupDescription}>
              Community work and student organization contributions outside formal employment.
            </p>
          </div>
          <ul className={styles.volunteerGrid}>
            {VOLUNTEER_EXPERIENCE.map((experience) => (
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
