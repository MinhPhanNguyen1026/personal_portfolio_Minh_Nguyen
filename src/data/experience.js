// Experience, modelled the way `juju status` models applications.
//
//   app      short slug shown in the App column (lowercase, hyphenated)
//   status   "active" for current roles, "terminated" for past ones
//   charm    the role, slugged like a charm name
//   channel  "stable" for current, null for past (renders as —)
//   period   { start, end } as "YYYY-MM" strings; end null = present.
//            Unknown dates are null and render as —.
//   cloud    provider/platform chips shown in the expanded row
//   details  bullet points for the expanded row (from the resume)
//
// Order within each group is display order.

export const CURRENT_ROLES = [
  {
    app: "canonical",
    company: "Canonical",
    role: "Software Engineer",
    type: "Full-time",
    status: "active",
    charm: "software-eng",
    channel: "stable",
    period: { start: null, end: null },
    href: "https://canonical.com/",
    logo: {
      src: "https://upload.wikimedia.org/wikipedia/commons/9/93/Canonical_logo_2023.svg",
      width: 1329,
      height: 400,
    },
    cloud: ["Ubuntu", "Juju", "MicroK8s"],
    // TODO(minh): team, product, what you build, stack.
    details: [],
  },
  {
    app: "interplay-lab",
    company: "Inter.play Lab",
    role: "Research Assistant",
    type: "Part-time",
    status: "active",
    charm: "research-asst",
    channel: "stable",
    period: { start: null, end: null },
    href: "https://interplaylab.com/",
    logo: {
      src: "https://interplaylab.com/wp-content/uploads/2025/09/Logo_v1.0-1.png",
      width: 874,
      height: 874,
      needsCanvas: true,
    },
    cloud: [],
    // TODO(minh): what the lab studies and what you build for it.
    details: [],
  },
];

export const PREVIOUS_EXPERIENCE = [
  {
    app: "onc-ai",
    company: "Onc.AI",
    role: "Software Engineer",
    type: "Contract",
    status: "terminated",
    charm: "software-eng",
    channel: null,
    period: { start: "2025-06", end: "2025-10" },
    href: "https://onc.ai/",
    logo: {
      src: "https://onc.ai/wp-content/uploads/2021/11/oncai_logo_updated-color-2.png",
      width: 304,
      height: 90,
    },
    cloud: ["GCP", "PostgreSQL", "FastAPI"],
    details: [
      "Built responsive clinical and competitor analytics dashboards in React and TypeScript, backed by FastAPI services with real-time updates.",
      "Shipped asynchronous RAG and agentic LLM services (LangGraph, PyTorch) with SSE streaming endpoints for high-frequency updates.",
      "Designed PostgreSQL data models for clinical datasets and NoSQL pipelines for semi-structured competitor data.",
      "Added Jest, React Testing Library, and Cypress coverage; deployed to GCP through CI/CD pipelines.",
    ],
  },
  {
    app: "ur-psych-lab",
    company: "University of Rochester",
    role: "Technical Assistant II",
    type: "Psychology Lab",
    status: "terminated",
    charm: "tech-assistant",
    channel: null,
    period: { start: "2024-11", end: "2026-05" },
    href: "https://www.rochester.edu/",
    logo: {
      src: "https://upload.wikimedia.org/wikipedia/en/7/76/University_of_Rochester_logo.svg",
      width: 690,
      height: 190,
    },
    cloud: ["Firebase", "Firestore"],
    details: [
      "Built AI-driven experimental gaming platforms with adversarial bot agents to study social and cognitive behaviour.",
      "Engineered multi-user web systems with React, Node.js, and Phaser.js, synchronised through Firebase/Firestore.",
      "Designed experiment UIs with ARIA roles and keyboard navigation as first-class requirements.",
    ],
  },
  {
    app: "roclab",
    company: "RocLab",
    role: "Frontend Lead",
    type: "Melcourses CDCS",
    status: "terminated",
    charm: "frontend-lead",
    channel: null,
    period: { start: "2023-11", end: "2025-05" },
    href: "https://linktr.ee/roclab",
    logo: {
      src: "https://ugc.production.linktr.ee/MW252fOzR3exjRUEiWn7_O7hkrL2IuY5eoVVJ?io=true&size=avatar-v3_0",
      width: 690,
      height: 190,
    },
    cloud: [],
    details: [
      "Designed multi-modal course search heuristics combining course text, metadata, and historical enrollment trends.",
      "Directed Agile sprints across a cross-functional team, delivering adaptive, SEO-optimised UI components.",
      "Scaled to 2000+ active users and secured official university endorsement.",
    ],
  },
  {
    app: "salesforce",
    company: "Salesforce",
    role: "Software Engineer Intern",
    type: "Internship",
    status: "terminated",
    charm: "swe-intern",
    channel: null,
    period: { start: "2024-05", end: "2024-08" },
    href: "https://www.salesforce.com/",
    logo: {
      src: "https://a.sfdcstatic.com/shared/images/c360-nav/salesforce-with-type-logo.svg",
      width: 512,
      height: 160,
    },
    cloud: [],
    details: [
      "Built internal data-quality reports and dashboards in Python and SQL across millions of knowledge base entries.",
      "Designed a migration engine moving legacy Java-based Knowledge V1 to Lightning Knowledge.",
      "Added CI/CD data-validation checks and Jest tests to guard correctness across deployments.",
    ],
  },
  {
    app: "ur-cs-ta",
    company: "University of Rochester",
    role: "CS Teaching Assistant",
    type: "Computer Science",
    status: "terminated",
    charm: "teaching-asst",
    channel: null,
    period: { start: null, end: null },
    href: "https://www.rochester.edu/",
    logo: {
      src: "https://upload.wikimedia.org/wikipedia/en/7/76/University_of_Rochester_logo.svg",
      width: 690,
      height: 190,
    },
    cloud: [],
    details: [],
  },
  {
    app: "onc-ai-intern",
    company: "Onc.AI",
    role: "Software Engineer Intern",
    type: "Internship",
    status: "terminated",
    charm: "swe-intern",
    channel: null,
    period: { start: null, end: null },
    href: "https://onc.ai/",
    logo: {
      src: "https://onc.ai/wp-content/uploads/2021/11/oncai_logo_updated-color-2.png",
      width: 304,
      height: 90,
    },
    cloud: ["GCP"],
    details: [],
  },
  {
    app: "roc-hci",
    company: "ROC-HCI Lab",
    role: "Research Assistant",
    type: "Internship",
    status: "terminated",
    charm: "research-asst",
    channel: null,
    period: { start: "2023-02", end: "2023-11" },
    href: "https://roc-hci.com/",
    logo: {
      src: "https://roc-hci.com/wp-content/uploads/vertical_logo-1-e1528565825525.png",
      width: 690,
      height: 190,
    },
    cloud: [],
    details: [
      "Led end-to-end development of an AI teaching assistant tool with React, TypeScript, Node.js, Redux, and LESS in a modular architecture.",
      "Deployed for active research use so faculty could streamline experiment workflows and accelerate data collection.",
    ],
  },
  {
    app: "aif",
    company: "Anime Interest Floor (UR)",
    role: "Web Master",
    type: "Special Interest Housing",
    status: "terminated",
    charm: "web-master",
    channel: null,
    period: { start: "2023-01", end: "2025-05" },
    href: "https://sonicfires2.github.io/landing-page-aif/",
    logo: {
      src: "https://sonicfires2.github.io/landing-page-aif/static/media/AIFlogo2025.d801c86c6569d6c3764e.png",
      width: 690,
      height: 190,
    },
    cloud: ["GitHub Pages"],
    details: [
      "Led the full-stack redevelopment of the floor's website; engagement and applications rose 23%.",
      "Mobile-first layouts, cross-browser compatibility, and accessibility as baseline requirements.",
      "Deployed and maintained through GitHub Pages with CI/CD for rapid content updates.",
    ],
  },
  {
    app: "pwc",
    company: "PwC",
    role: "Digital Transformation Consultant",
    type: "Seasonal",
    status: "terminated",
    charm: "consultant",
    channel: null,
    period: { start: null, end: null },
    href: "https://www.pwc.com/vn/en",
    logo: {
      src: "https://sb-web-assets.s3.amazonaws.com/production/2877/PwC_fl_c.png",
      width: 690,
      height: 190,
    },
    cloud: [],
    details: [],
  },
];

export const VOLUNTEER_EXPERIENCE = [
  {
    app: "dandyhacks",
    company: "University of Rochester",
    role: "Hackathon Organizer",
    type: "DandyHacks",
    status: "volunteer",
    charm: "organizer",
    channel: null,
    period: { start: null, end: null },
    href: "https://dandyhacks.net",
    logo: {
      src: "https://upload.wikimedia.org/wikipedia/en/7/76/University_of_Rochester_logo.svg",
      width: 690,
      height: 190,
    },
    cloud: [],
    details: [],
  },
  {
    app: "tora-con",
    company: "Rochester Institute of Technology",
    role: "Staff Guest Handler",
    type: "Tora-Con",
    status: "volunteer",
    charm: "guest-handler",
    channel: null,
    period: { start: null, end: null },
    href: "https://toracon.org/home",
    logo: {
      src: "https://images.squarespace-cdn.com/content/v1/648a0ccd5f3a811d210f1d54/86546892-e74d-4973-b607-c4f338b24b67/Tora-Con+2026+Logo+%28w_+anime%29.png?format=1500w",
      width: 690,
      height: 190,
    },
    cloud: [],
    details: [],
  },
];

export const ALL_EXPERIENCE = [...CURRENT_ROLES, ...PREVIOUS_EXPERIENCE, ...VOLUNTEER_EXPERIENCE];
