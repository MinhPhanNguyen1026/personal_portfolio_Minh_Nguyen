// The site's sections, in the vocabulary of the shell: each one is a
// "controller" you can `juju switch` to. Order is display/scroll order.
//
//   id       DOM id and URL hash
//   title    human name for headings and button labels
//   blurb    one line for `juju controllers` / `juju models` output

export const SECTIONS = [
  { id: "login", title: "Login", blurb: "who is this, and why are you here" },
  { id: "experience", title: "Experience", blurb: "employers as applications" },
  { id: "projects", title: "Projects", blurb: "shipped work as a terraform plan" },
  { id: "skills", title: "Skills", blurb: "the pipeline that builds the rest" },
  { id: "contact", title: "Contact", blurb: "get in touch" },
];

export const DEFAULT_SECTION = SECTIONS[0].id;

export function findSection(id) {
  return SECTIONS.find((s) => s.id === id) || null;
}

// Sections reachable by `juju switch` — everything but the login itself.
export const SWITCHABLE = SECTIONS.filter((s) => s.id !== "login");
