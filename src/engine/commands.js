// The command engine. Pure: execute(input, ctx) → { lines, effects }.
//
// The UI's nav buttons, the section command boxes, and the terminal's
// text input all call this — one dispatch path is what makes the terminal
// honest rather than decorative. Every command shown anywhere in the UI
// is implemented here.
//
//   ctx.current   id of the active section
//   ctx.theme     "light" | "dark" | "system"
//   ctx.loggedIn  boolean
//
//   lines[]       { kind: "out" | "ok" | "warn" | "err" | "info" | "muted", text }
//   effects       { switchTo?, clear?, theme?, login?, logout? }  — the hook
//                 applies these; the engine only describes them.

import { parse } from "./parse";
import { SECTIONS, SWITCHABLE, findSection } from "./sections";
import { PROFILE } from "../data/profile";
import { CURRENT_ROLES, PREVIOUS_EXPERIENCE } from "../data/experience";
import { PROJECTS } from "../data/projects";
import { PIPELINE } from "../data/skills";

/* global __BUILD_SHA__ */
const BUILD_SHA = typeof __BUILD_SHA__ === "string" ? __BUILD_SHA__ : "local";

const CONTROLLER = PROFILE.handle;
const line = (kind, text) => ({ kind, text });
const out = (text) => line("out", text);
const ok = (text) => line("ok", text);
const err = (text) => line("err", text);
const muted = (text) => line("muted", text);
const blank = () => out("");

const HELP = [
  ["juju switch <controller>", "go to a section (experience, projects, skills, contact)"],
  ["juju status [--model <m>]", "what's running; --model picks the section"],
  ["juju controllers", "list sections"],
  ["juju expose contact", "reveal the contact channels"],
  ["juju login | logout", "replay the login / lock the hero"],
  ["terraform plan", "the projects, as the plan that would build them"],
  ["gh run view build-minh", "the skills pipeline"],
  ["theme [dark|light|system]", "set the colour scheme"],
  ["ls, pwd, cat, whoami, clear", "the usual"],
  ["help", "this"],
];

function pad(s, n) {
  return String(s).padEnd(n);
}

function table(rows) {
  const widths = rows[0].map((_, i) => Math.max(...rows.map((r) => String(r[i]).length)));
  return rows.map((r) => r.map((c, i) => (i === r.length - 1 ? String(c) : pad(c, widths[i]))).join("  "));
}

// Split ["--model", "x", "-m", "y", "--model=z", "pos"] into
// { flags: { model: "z" }, positional: ["pos"] }.
function flags(args, spec) {
  const result = { flags: {}, positional: [] };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    const eq = a.indexOf("=");
    const name = eq > -1 ? a.slice(0, eq) : a;
    const key = spec[name];
    if (key) {
      result.flags[key] = eq > -1 ? a.slice(eq + 1) : args[++i];
    } else {
      result.positional.push(a);
    }
  }
  return result;
}

// Navigate only when the target differs from where we are.
const go = (target, ctx) => (target && target !== ctx.current ? { switchTo: target } : {});

/* ------------------------------ views ------------------------------ */
// Each section has one function that renders its "view" as lines. The
// command that owns the section calls it; `juju status` also uses them.

function statusHeader(model) {
  return table([
    ["Model", "Controller", "Cloud/Region", "Version", "Timestamp"],
    [CONTROLLER, model, "microk8s/localhost", "3.6.4", "now"],
  ]).map(out);
}

function experienceView() {
  const rows = [["App", "Version", "Status", "Scale", "Charm"]];
  for (const r of CURRENT_ROLES) rows.push([r.app, "current", "active", "1", r.charm]);
  for (const r of PREVIOUS_EXPERIENCE) rows.push([r.app, r.period.end?.slice(0, 4) ?? "—", "terminated", "1", r.charm]);
  return table(rows).map((t, i) => (i === 0 ? muted(t) : t.includes("  active  ") ? ok(t) : out(t)));
}

function projectsView() {
  const lines = [out("Terraform will perform the following actions:"), blank()];
  for (const p of PROJECTS) {
    lines.push(muted(`  # module.projects.${p.type}.${p.id} will be created`));
    lines.push(ok(`  + resource "${p.type}" "${p.id}"`));
    for (const [k, v] of p.attrs.slice(0, 2)) lines.push(ok(`      + ${pad(k, 6)} = "${v}"`));
    lines.push(blank());
  }
  lines.push(out(`Plan: ${PROJECTS.length} to add, 0 to change, 0 to destroy.`));
  return lines;
}

function skillsView() {
  const total = PIPELINE.reduce((n, s) => n + s.jobs.length, 0);
  const running = PIPELINE.reduce((n, s) => n + s.jobs.filter((j) => j.state === "running").length, 0);
  return [
    ok(`✓ build-minh · main · #${BUILD_SHA}`),
    blank(),
    muted("JOBS"),
    ...PIPELINE.map((s) => {
      const r = s.jobs.filter((j) => j.state === "running").length;
      return r ? line("warn", `› ${pad(s.stage, 18)} ${s.jobs.length} jobs, ${r} running`) : ok(`✓ ${pad(s.stage, 18)} ${s.jobs.length} jobs`);
    }),
    blank(),
    out(`${total - running} passed${running ? `, ${running} running` : ""}.`),
  ];
}

function contactView() {
  return [
    muted(table([["App", "Status", "Exposed", "Address"]])[0]),
    ...PROFILE.links.map((l) => ok(`${pad(l.key, 9)} active  true     ${l.href.replace(/^mailto:/, "")}`)),
  ];
}

const VIEWS = { experience: experienceView, projects: projectsView, skills: skillsView, contact: contactView };

/* ------------------------------ juju ------------------------------ */

function jujuSwitch(args, ctx) {
  const target = args[0];
  if (!target) {
    return { lines: [out(`${CONTROLLER}:admin/${ctx.current}`)], effects: {} };
  }
  const section = findSection(target);
  if (!section || section.id === "login") {
    return {
      lines: [err(`ERROR "${target}" is not a controller. Try: ${SWITCHABLE.map((s) => s.id).join(", ")}`)],
      effects: {},
    };
  }
  if (section.id === ctx.current) {
    return { lines: [muted(`${CONTROLLER}:admin/${section.id} (already current)`)], effects: {} };
  }
  return {
    lines: [out(`${CONTROLLER}:admin/${ctx.current} -> ${CONTROLLER}:admin/${section.id}`)],
    effects: { switchTo: section.id },
  };
}

function jujuControllers(_args, ctx) {
  const rows = [["Controller", "Model", "Description"]];
  for (const s of SECTIONS) {
    const mark = s.id === ctx.current ? "*" : " ";
    rows.push([`${s.id}${mark}`, `admin/${s.id}`, s.blurb]);
  }
  return { lines: [muted("Use --refresh option with this command to see the latest information."), ...table(rows).map(out)], effects: {} };
}

function jujuStatus(args, ctx) {
  const { flags: f } = flags(args, { "--model": "model", "-m": "model" });
  let model = ctx.current;
  if (f.model !== undefined) {
    const section = findSection(f.model);
    if (!section) {
      return { lines: [err(`ERROR model "${f.model}" not found`), muted(`Models: ${SECTIONS.map((s) => s.id).join(", ")}`)], effects: {} };
    }
    model = section.id;
  }
  const view = VIEWS[model];
  const body = view ? view() : [ok(`${PROFILE.handle}/0  active  ${PROFILE.title} @ ${PROFILE.employer.name}`)];
  return { lines: [...statusHeader(model), blank(), ...body], effects: go(model, ctx) };
}

function jujuExpose(args, ctx) {
  const app = args[0];
  if (!app) return { lines: [err("ERROR no application name specified")], effects: {} };
  if (app !== "contact") return { lines: [err(`ERROR application "${app}" not found`)], effects: {} };
  return { lines: [out(`${PROFILE.links.length} endpoints exposed on contact/0:`), ...contactView()], effects: go("contact", ctx) };
}

function jujuWhoami(_args, ctx) {
  return {
    lines: [out(`Controller:  ${CONTROLLER}`), out(`Model:       admin/${ctx.current}`), out(`User:        ${ctx.loggedIn ? "visitor" : "(not logged in)"}`)],
    effects: {},
  };
}

function juju(args, ctx) {
  const [sub, ...rest] = args;
  switch (sub) {
    case "switch":
      return jujuSwitch(rest, ctx);
    case "controllers":
    case "models":
      return jujuControllers(rest, ctx);
    case "status":
      return jujuStatus(rest, ctx);
    case "expose":
      return jujuExpose(rest, ctx);
    case "whoami":
      return jujuWhoami(rest, ctx);
    case "login":
      return { lines: [out(`Connecting to ${CONTROLLER}…`)], effects: { login: true, switchTo: "login" } };
    case "logout":
      return { lines: [out(`Logged out of ${CONTROLLER}.`)], effects: { logout: true, switchTo: "login" } };
    case undefined:
    case "help":
    case "--help":
      return { lines: HELP.filter(([c]) => c.startsWith("juju")).map(([c, d]) => out(`${pad(c, 28)} ${d}`)), effects: {} };
    default:
      return { lines: [err(`ERROR unrecognized command: juju ${sub}`), muted("Try: juju help")], effects: {} };
  }
}

/* --------------------------- terraform / gh --------------------------- */

function terraform(args, ctx) {
  const [sub, ...rest] = args;
  switch (sub) {
    case "plan": {
      const { flags: f } = flags(rest, { "-target": "target", "--target": "target" });
      if (f.target && f.target !== "module.projects") {
        return { lines: [err(`Error: no resource matches -target=${f.target}`), muted("Try: terraform plan -target=module.projects")], effects: {} };
      }
      return { lines: projectsView(), effects: go("projects", ctx) };
    }
    case "apply":
      return { lines: [err("Error: apply is not permitted on this workspace."), muted("This is a portfolio. Run `terraform plan` to see what it would build.")], effects: {} };
    case "version":
    case "-v":
    case "--version":
      return { lines: [out("Terraform v1.9.x"), muted("on portfolio_web")], effects: {} };
    default:
      return { lines: [err(`Terraform has no command named "${sub ?? ""}".`), muted("Try: terraform plan")], effects: {} };
  }
}

function gh(args, ctx) {
  const [sub, action, target] = args;
  if (sub === "run" && action === "view") {
    if (target && target !== "build-minh") {
      return { lines: [err(`could not find run "${target}"`), muted("Try: gh run view build-minh")], effects: {} };
    }
    return { lines: skillsView(), effects: go("skills", ctx) };
  }
  if (sub === "run" && action === "list") {
    return { lines: [ok(`completed  success  build-minh  main  #${BUILD_SHA}`)], effects: {} };
  }
  return { lines: [err(`unknown command "${args.join(" ")}" for "gh"`), muted("Try: gh run view build-minh")], effects: {} };
}

/* ----------------------------- builtins ----------------------------- */

const BUILTINS = {
  juju,
  terraform,
  gh,
  help: () => ({ lines: HELP.map(([c, d]) => out(`${pad(c, 28)} ${d}`)), effects: {} }),
  clear: () => ({ lines: [], effects: { clear: true } }),
  whoami: () => ({ lines: [out("visitor")], effects: {} }),
  pwd: (_a, ctx) => ({ lines: [out(`/controllers/${ctx.current}`)], effects: {} }),
  ls: () => ({ lines: [out(SWITCHABLE.map((s) => `${s.id}/`).join("  "))], effects: {} }),
  echo: (args) => ({ lines: [out(args.join(" "))], effects: {} }),
  theme: (args, ctx) => {
    const t = args[0];
    if (!t) return { lines: [out(ctx.theme)], effects: {} };
    if (!["dark", "light", "system"].includes(t)) return { lines: [err(`theme: unknown scheme "${t}" (dark, light, system)`)], effects: {} };
    return { lines: [ok(`theme set to ${t}`)], effects: { theme: t } };
  },
  cat: (args) => {
    const f = args[0] ?? "";
    if (/contact/.test(f)) return { lines: PROFILE.links.map((l) => out(`${pad(l.label, 10)} ${l.href}`)), effects: {} };
    if (/about|readme/i.test(f)) return { lines: PROFILE.about.map(out), effects: {} };
    return { lines: [err(`cat: ${f || "(none)"}: No such file or directory`)], effects: {} };
  },
  // Convenience aliases so the obvious things work.
  cd: (args, ctx) => jujuSwitch(args.length ? [args[0].replace(/^\/?controllers\//, "").replace(/\/$/, "")] : [], ctx),
  exit: () => ({ lines: [muted("There is no exit. There is only scroll.")], effects: {} }),
};

/* ------------------------------ entry ------------------------------ */

export function execute(input, ctx) {
  const parsed = parse(input);
  if (!parsed) return { lines: [], effects: {} };
  const handler = BUILTINS[parsed.cmd];
  if (!handler) {
    return { lines: [err(`bash: ${parsed.cmd}: command not found`), muted("Try: help")], effects: {} };
  }
  return handler(parsed.args, ctx);
}

// The command a nav control runs for a given section — the single source
// of the "click fills the command" behaviour.
export function switchCommand(sectionId) {
  return `juju switch ${sectionId}`;
}
