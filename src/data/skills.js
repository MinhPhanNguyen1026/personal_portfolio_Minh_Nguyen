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
      { name: "TypeScript", usedAt: ["onc-ai", "roc-hci", "melcourses", "teacher_authoring"] },
      { name: "JavaScript", usedAt: ["roclab", "aif", "ur-psych-lab"] },
      { name: "Python", usedAt: ["onc-ai", "salesforce", "onc_kpi"] },
      { name: "Go", usedAt: [] },
      { name: "Rust", usedAt: [] },
      { name: "Java", usedAt: ["salesforce"] },
      { name: "C / C++", usedAt: [] },
    ],
  },
  {
    stage: "frontend",
    jobs: [
      { name: "React", usedAt: ["onc-ai", "roclab", "roc-hci", "aif", "ur-psych-lab"] },
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
      { name: "MongoDB", usedAt: ["onc_kpi"] },
      { name: "Firebase", usedAt: ["ur-psych-lab"] },
      { name: "RAG / LLM services", usedAt: ["onc-ai"] },
    ],
  },
  {
    stage: "infra & cloud",
    jobs: [
      { name: "Kubernetes", usedAt: ["canonical"] },
      { name: "MicroK8s", usedAt: ["canonical"] },
      { name: "Juju charms", usedAt: ["canonical"] },
      { name: "Docker", usedAt: [] },
      { name: "GCP", usedAt: ["onc-ai", "onc_kpi"] },
      { name: "CI/CD", usedAt: ["onc-ai", "salesforce", "aif"] },
      { name: "Ubuntu / Linux", usedAt: ["canonical"] },
      // TODO(minh): confirm depth before shipping; remove if not accurate.
      { name: "Terraform", usedAt: [], state: "running" },
    ],
  },
  {
    stage: "testing & tooling",
    jobs: [
      { name: "Jest / RTL", usedAt: ["onc-ai", "salesforce"] },
      { name: "Cypress", usedAt: ["onc-ai"] },
      { name: "Pytest", usedAt: ["ur-psych-lab"] },
      { name: "GitHub Actions", usedAt: ["aif"] },
      { name: "Git", usedAt: [] },
      { name: "Vite / Webpack", usedAt: [] },
    ],
  },
];
