// Who the site is about. Rendered by the MOTD (hero), the status bar, the
// contact section, and the JSON-LD Person schema. Edit here, not in
// components.

export const PROFILE = {
  name: "Minh Nguyen",
  firstName: "Minh",
  lastName: "Nguyen",
  // Used as the shell user and in the prompt: minh@portfolio
  handle: "minh",
  host: "portfolio",
  title: "Software Engineer",
  employer: {
    name: "Canonical",
    href: "https://canonical.com/",
  },
  location: "Rochester, NY",
  // One sentence, human voice. Shown under the name in the MOTD.
  tagline:
    "Crafting software end to end — platform tooling on one side, fast and accessible web on the other, with a soft spot for thoughtful detail.",
  // TODO(minh): replace with what you actually build at Canonical (team,
  // product, stack). Shown as the second MOTD line and in the canonical
  // experience row.
  currentWork:
    "Software Engineer at Canonical and part-time Research Assistant at Inter.play Lab.",
  about: [
    "I'm a software engineer focused on building fast, accessible frontend experiences and dependable backend systems.",
    "I've worked across startups, big tech, and research labs, turning ideas into production features and collaborating with teams to build inclusive, polished products.",
  ],
  education: {
    school: "University of Rochester",
    href: "https://www.rochester.edu/",
    degrees: [
      { name: "M.S. Computer Science", year: "2026" },
      { name: "B.S. Computer Science, High Distinction", year: "2025" },
    ],
    awards: ["MetaCTF top winner (6th of 1300)", "Dean's Scholarship", "Master's Scholarship"],
  },
  links: [
    { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/minh-nguyen-98a48a245/", external: true },
    { key: "github", label: "GitHub", href: "https://github.com/Sonicfires2", external: true },
    { key: "email", label: "Email", href: "mailto:mnguyen31@u.rochester.edu", external: false },
    { key: "resume", label: "Resume", href: "Minh_Nguyen_Resume.pdf", download: "Minh_Nguyen_Resume.pdf", external: false },
  ],
  // The public URL of the deployed site, for canonical/OG tags.
  siteUrl: "https://minhphannguyen1026.github.io/personal_portfolio_Minh_Nguyen/",
  repo: { owner: "MinhPhanNguyen1026", name: "personal_portfolio_Minh_Nguyen" },
};
