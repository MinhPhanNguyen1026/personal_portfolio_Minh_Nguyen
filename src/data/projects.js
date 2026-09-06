// Projects, modelled as Terraform resources.
//
//   type      the HCL resource type (web_app, dashboard, research_tool)
//   id        the HCL resource name
//   attrs     ordered key/value pairs rendered inside the block. Strings
//             render quoted, arrays as lists, numbers bare. The renderer
//             pads keys to the longest one so `=` aligns like terraform fmt.
//   links     { label, href } — a null href renders as a disabled
//             "Confidential code" chip.
//   image     imported by the component from src/assets/projects/

export const PROJECTS = [
  {
    type: "web_app",
    id: "melcourses",
    title: "Melcourses CDCS System",
    summary:
      "A modern course description and discovery system for University of Rochester students, replacing an outdated CDCS workflow and supporting course planning at scale.",
    attrs: [
      ["name", "Melcourses CDCS System"],
      ["role", "Frontend Lead"],
      ["stack", ["Next.js", "React", "TypeScript", "SQL", "Chakra UI"]],
      ["users", "2000+"],
      ["url", "https://melcourses.com"],
    ],
    links: [
      { label: "Live site", href: "https://melcourses.com" },
      { label: "Code", href: null },
    ],
    image: "project4",
    alt: "Melcourses course discovery interface",
  },
  {
    type: "research_tool",
    id: "teacher_authoring",
    title: "Teacher Authoring Tool",
    summary:
      "A research-backed authoring platform that helps K-12 teachers create interactive AI-literacy assignments and classroom activities.",
    attrs: [
      ["name", "Teacher Authoring Tool"],
      ["role", "Research Assistant"],
      ["stack", ["React", "TypeScript", "Redux", "LESS"]],
      ["domain", "AI literacy · K-12"],
      ["paper", "https://advait.org/files/zhou_2024_k12_ML.pdf"],
    ],
    links: [
      { label: "Published paper", href: "https://advait.org/files/zhou_2024_k12_ML.pdf" },
      { label: "Code", href: null },
    ],
    image: "project3",
    alt: "Teacher authoring tool interface",
  },
  {
    type: "web_app",
    id: "aif_landing",
    title: "Anime Interest Floor Landing Page",
    summary:
      "A responsive landing page for the University of Rochester's Anime Interest Floor, giving a 300+ member community a clearer home for events, identity, and organisation details.",
    attrs: [
      ["name", "Anime Interest Floor"],
      ["role", "Web Master"],
      ["stack", ["React", "JavaScript", "CSS", "HTML"]],
      ["members", "300+"],
      ["url", "https://sonicfires2.github.io/landing-page-aif/"],
    ],
    links: [
      { label: "Live site", href: "https://sonicfires2.github.io/landing-page-aif/" },
      { label: "Code", href: "https://github.com/Sonicfires2/landing-page-aif" },
    ],
    image: "project1",
    alt: "Anime Interest Floor landing page",
  },
];
