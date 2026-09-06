// Skills, modelled as a CI pipeline: stages run left to right, each stage
// holds jobs. `usedAt` lists experience `app` slugs (see experience.js) or
// project ids (see projects.js) so a job can show where it was applied.
//
// `state` is "passed" by default; "running" marks something actively being
// learned. Keep it honest — it shows as a yellow job.

export const PIPELINE = [
  {
    stage: "languages",
    jobs: [
      { name: "TypeScript", usedAt: ["onc-ai", "upstart", "roclab", "roc-hci", "melcourses", "teacher_authoring"] },
      { name: "JavaScript", usedAt: ["roclab", "aif", "ur-psych-lab"] },
      { name: "Python", usedAt: ["canonical", "onc-ai", "salesforce"] },
      { name: "Go", usedAt: ["canonical"] },
      { name: "Rust", usedAt: [] },
      { name: "Java", usedAt: ["salesforce"] },
      { name: "C / C++", usedAt: [] },
    ],
  },
  {
    stage: "frontend",
    jobs: [
      { name: "React", usedAt: ["onc-ai", "upstart", "roclab", "roc-hci", "aif", "ur-psych-lab"] },
      { name: "Next.js", usedAt: ["melcourses"] },
      { name: "Redux", usedAt: ["roc-hci", "teacher_authoring"] },
      { name: "React Native", usedAt: [] },
      { name: "Accessibility", usedAt: ["ur-psych-lab", "aif"] },
      { name: "Phaser.js", usedAt: ["ur-psych-lab"] },
    ],
  },
  {
    stage: "backend & data",
    jobs: [
      { name: "Node.js", usedAt: ["roclab", "roc-hci", "ur-psych-lab"] },
      { name: "FastAPI", usedAt: ["onc-ai"] },
      { name: "PostgreSQL", usedAt: ["onc-ai"] },
      { name: "MongoDB", usedAt: ["onc-ai"] },
      { name: "Firebase", usedAt: ["ur-psych-lab"] },
      { name: "RAG / LLM services", usedAt: ["canonical", "onc-ai"] },
    ],
  },
  {
    stage: "infra & cloud",
    jobs: [
      { name: "Kubernetes", usedAt: ["canonical"] },
      { name: "MicroK8s", usedAt: ["canonical"] },
      { name: "Juju charms", usedAt: ["canonical"] },
      { name: "Terraform", usedAt: ["canonical"] },
      { name: "Docker", usedAt: [] },
      { name: "GCP", usedAt: ["onc-ai", "onc-ai-intern"] },
      { name: "AWS S3", usedAt: ["upstart"] },
      { name: "CI/CD", usedAt: ["canonical", "onc-ai", "salesforce", "aif"] },
      { name: "Ubuntu / Linux", usedAt: ["canonical"] },
    ],
  },
  {
    stage: "testing & tooling",
    jobs: [
      { name: "Pytest", usedAt: ["canonical", "ur-psych-lab"] },
      { name: "Jest / RTL", usedAt: ["onc-ai", "salesforce"] },
      { name: "Cypress", usedAt: ["onc-ai"] },
      { name: "Selenium", usedAt: ["salesforce"] },
      { name: "Sphinx / Read the Docs", usedAt: ["canonical"] },
      { name: "GitHub Actions", usedAt: ["canonical", "aif"] },
      { name: "Git", usedAt: ["canonical"] },
      { name: "Vite / Webpack", usedAt: [] },
    ],
  },
];
