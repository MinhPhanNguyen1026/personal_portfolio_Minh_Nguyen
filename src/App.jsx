// Phase 0 skeleton: the section structure and landmarks with data wired
// through, no shell yet. Phase 1 adds the status bar, terminal drawer, and
// command engine; later phases replace each section body.

import { PROFILE } from "./data/profile";
import { CURRENT_ROLES, PREVIOUS_EXPERIENCE, VOLUNTEER_EXPERIENCE } from "./data/experience";
import { PROJECTS } from "./data/projects";
import { PIPELINE } from "./data/skills";

const SECTIONS = [
  { id: "experience", title: "Experience" },
  { id: "projects", title: "Projects" },
  { id: "skills", title: "Skills" },
  { id: "contact", title: "Contact" },
];

function RoleList({ roles }) {
  return (
    <ul>
      {roles.map((r) => (
        <li key={r.app}>
          <code>{r.app}</code> — {r.company}, {r.role} ({r.status})
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header>
        <h1>{PROFILE.name}</h1>
        <p>
          {PROFILE.title} at{" "}
          <a href={PROFILE.employer.href} target="_blank" rel="noreferrer noopener">
            {PROFILE.employer.name}
          </a>
        </p>
        <p>{PROFILE.tagline}</p>
        <nav aria-label="Sections">
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main">
        <section id="experience" aria-labelledby="experience-title">
          <h2 id="experience-title">Experience</h2>
          <h3>Current</h3>
          <RoleList roles={CURRENT_ROLES} />
          <h3>Previous</h3>
          <RoleList roles={PREVIOUS_EXPERIENCE} />
          <h3>Volunteer</h3>
          <RoleList roles={VOLUNTEER_EXPERIENCE} />
        </section>

        <section id="projects" aria-labelledby="projects-title">
          <h2 id="projects-title">Projects</h2>
          <ul>
            {PROJECTS.map((p) => (
              <li key={p.id}>
                <code>
                  resource "{p.type}" "{p.id}"
                </code>{" "}
                — {p.title}
              </li>
            ))}
          </ul>
        </section>

        <section id="skills" aria-labelledby="skills-title">
          <h2 id="skills-title">Skills</h2>
          {PIPELINE.map((stage) => (
            <div key={stage.stage}>
              <h3>{stage.stage}</h3>
              <ul>
                {stage.jobs.map((j) => (
                  <li key={j.name}>{j.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title">Contact</h2>
          <ul>
            {PROFILE.links.map((l) => (
              <li key={l.key}>
                <a
                  href={l.href.startsWith("http") || l.href.startsWith("mailto:") ? l.href : `${import.meta.env.BASE_URL}${l.href}`}
                  download={l.download}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noreferrer noopener" : undefined}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer>
        <p>Designed and developed by {PROFILE.name}.</p>
      </footer>
    </>
  );
}
