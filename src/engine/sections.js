// The site's sections, in the vocabulary of the shell: each one is a
// "controller" you can `juju switch` to. Order is display/scroll order.
//
//   id       DOM id and URL hash
//   title    human name for headings and button labels
//   blurb    one line for `juju controllers` / `juju models` output
//   command  the command that produces this section's view. Shown above
//            the section with copy/run buttons, and every one of them is
//            implemented in commands.js — typing it does what the box says.

export const SECTIONS = [
  { id: "login", title: "Login", blurb: "who is this, and why are you here", command: "juju login" },
  { id: "experience", title: "Experience", blurb: "employers as applications", command: "juju status --model experience" },
  { id: "projects", title: "Projects", blurb: "shipped work as a terraform plan", command: "terraform plan -target=module.projects" },
  { id: "opensource", title: "Open source", blurb: "upstream work in the tools that build the platform", command: "gh search prs --author=@me --owner=canonical --merged" },
  { id: "skills", title: "Skills", blurb: "the pipeline that builds the rest", command: "gh run view build-minh" },
  { id: "contact", title: "Contact", blurb: "get in touch", command: "juju expose contact" },
  // The tail of the transcript: output of anything typed at the prompt
  // lands here. It has no command of its own — the live prompt is it.
  { id: "transcript", title: "Transcript", blurb: "what you've run", command: null },
];

export const DEFAULT_SECTION = SECTIONS[0].id;

export function findSection(id) {
  return SECTIONS.find((s) => s.id === id) || null;
}

// Sections reachable by `juju switch` — everything but the login itself.
export const SWITCHABLE = SECTIONS.filter((s) => s.id !== "login");
