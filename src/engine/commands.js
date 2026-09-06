// The command engine. Pure: execute(input, ctx) → { lines, effects }.
//
// The UI's nav buttons and the terminal's text input both call this — one
// dispatch path is what makes the terminal honest rather than decorative.
//
//   ctx.current   id of the active section
//   ctx.theme     "light" | "dark" | "system"
//   ctx.loggedIn  boolean
//
//   lines[]       { kind: "out" | "ok" | "warn" | "err" | "info" | "muted", text }
//   effects       { switchTo?, clear?, theme?, login?, open? }  — the hook
//                 applies these; the engine only describes them.

import { parse } from "./parse";
import { SECTIONS, SWITCHABLE, findSection } from "./sections";
import { PROFILE } from "../data/profile";
import { CURRENT_ROLES, PREVIOUS_EXPERIENCE } from "../data/experience";
import { PROJECTS } from "../data/projects";
import { PIPELINE } from "../data/skills";

const CONTROLLER = PROFILE.handle;
const line = (kind, text) => ({ kind, text });
const out = (text) => line("out", text);
const ok = (text) => line("ok", text);
const err = (text) => line("err", text);
const muted = (text) => line("muted", text);

const HELP = [
  ["juju switch <controller>", "go to a section (experience, projects, skills, contact)"],
  ["juju controllers", "list sections"],
  ["juju status", "what's running in the current section"],
  ["juju whoami", "controller, model, and user"],
  ["juju login", "replay the login"],
  ["theme [dark|light|system]", "set the colour scheme"],
  ["ls, pwd, whoami, clear", "the usual"],
  ["help", "this"],
];

function pad(s, n) {
  return String(s).padEnd(n);
}

function table(rows) {
  const widths = rows[0].map((_, i) => Math.max(...rows.map((r) => String(r[i]).length)));
  return rows.map((r) => r.map((c, i) => (i === r.length - 1 ? String(c) : pad(c, widths[i]))).join("  "));
}

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

function jujuStatus(_args, ctx) {
  const header = table([
    ["Model", "Controller", "Cloud/Region", "Version", "Timestamp"],
    [CONTROLLER, ctx.current, "microk8s/localhost", "3.6.4", "now"],
  ]).map(out);

  let body;
  switch (ctx.current) {
    case "experience": {
      const rows = [["App", "Version", "Status", "Scale", "Charm"]];
      for (const r of CURRENT_ROLES) rows.push([r.app, "current", "active", "1", r.charm]);
      for (const r of PREVIOUS_EXPERIENCE.slice(0, 3)) rows.push([r.app, r.period.end?.slice(0, 4) ?? "—", "terminated", "1", r.charm]);
      rows.push([`… ${PREVIOUS_EXPERIENCE.length - 3} more`, "", "", "", ""]);
      body = table(rows).map((t, i) => (i === 0 ? muted(t) : t.includes("active") ? ok(t) : out(t)));
      break;
    }
    case "projects":
      body = [
        muted("App          Status   Resource"),
        ...PROJECTS.map((p) => ok(`${pad(p.id, 12)} planned  ${p.type}.${p.id}`)),
        out(`Plan: ${PROJECTS.length} to add, 0 to change, 0 to destroy.`),
      ];
      break;
    case "skills": {
      const total = PIPELINE.reduce((n, s) => n + s.jobs.length, 0);
      const running = PIPELINE.reduce((n, s) => n + s.jobs.filter((j) => j.state === "running").length, 0);
      body = [
        ...PIPELINE.map((s) => ok(`${pad(s.stage, 18)} ${s.jobs.length} jobs  passed`)),
        out(`${total - running} passed, ${running} running.`),
      ];
      break;
    }
    case "contact":
      body = PROFILE.links.map((l) => ok(`${pad(l.key, 10)} active  ${l.href}`));
      break;
    default:
      body = [ok(`${PROFILE.handle}/0  active  ${PROFILE.title} @ ${PROFILE.employer.name}`)];
  }
  return { lines: [...header, out(""), ...body], effects: {} };
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
    case "whoami":
      return jujuWhoami(rest, ctx);
    case "login":
      return { lines: [out(`Connecting to ${CONTROLLER}…`)], effects: { login: true, switchTo: "login" } };
    case "logout":
      return { lines: [out(`Logged out. You are now logged out of ${CONTROLLER}.`)], effects: { switchTo: "login", login: true } };
    case undefined:
    case "help":
    case "--help":
      return { lines: HELP.filter(([c]) => c.startsWith("juju")).map(([c, d]) => out(`${pad(c, 28)} ${d}`)), effects: {} };
    default:
      return { lines: [err(`ERROR unrecognized command: juju ${sub}`), muted("Try: juju help")], effects: {} };
  }
}

/* ----------------------------- builtins ----------------------------- */

const BUILTINS = {
  juju,
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
