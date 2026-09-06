import { execute, switchCommand } from "./commands";
import { tokenize } from "./parse";
import { SECTIONS } from "./sections";

const ctx = { current: "experience", theme: "system", loggedIn: true };

describe("tokenize", () => {
  test("splits on whitespace and honours quotes", () => {
    expect(tokenize('juju switch "my section"  x')).toEqual(["juju", "switch", "my section", "x"]);
    expect(tokenize("echo 'a b' c\\ d")).toEqual(["echo", "a b", "c d"]);
    expect(tokenize("   ")).toEqual([]);
  });
});

describe("juju switch", () => {
  test("emits a switchTo effect for a known controller", () => {
    const r = execute("juju switch projects", ctx);
    expect(r.effects.switchTo).toBe("projects");
    expect(r.lines[0].text).toContain("minh:admin/experience -> minh:admin/projects");
  });

  test("rejects unknown controllers; login is a valid target (it's listed by `juju models`)", () => {
    expect(execute("juju switch nope", ctx).lines[0].kind).toBe("err");
    expect(execute("juju switch login", ctx).effects.switchTo).toBe("login");
  });

  test("`cd ~` (and bare `cd`) go home without replaying the login", () => {
    for (const cmd of ["cd ~", "cd", "cd /"]) {
      const r = execute(cmd, ctx);
      expect(r.effects).toEqual({ switchTo: "login" });
      expect(r.lines).toEqual([]);
    }
    expect(execute("cd ~/projects", ctx).effects.switchTo).toBe("projects");
    expect(execute("cd controllers/skills", ctx).effects.switchTo).toBe("skills");
  });

  test("still scrolls to the section when it is already current", () => {
    const r = execute("juju switch experience", ctx);
    expect(r.effects.switchTo).toBe("experience");
    expect(r.lines[0].kind).toBe("muted");
    expect(r.lines[0].text).toContain("already current");
  });

  test("switchCommand is what the nav buttons run", () => {
    expect(execute(switchCommand("skills"), ctx).effects.switchTo).toBe("skills");
  });
});

describe("every section's own command is implemented and navigates there", () => {
  // The transcript has no command of its own — the live prompt is it.
  for (const s of SECTIONS.filter((x) => x.command)) {
    test(`${s.id}: ${s.command}`, () => {
      const r = execute(s.command, { ...ctx, current: "login" });
      expect(r.lines.some((l) => l.kind === "err")).toBe(false);
      if (s.id === "login") {
        expect(r.effects.login).toBe(true);
      } else {
        expect(r.effects.switchTo).toBe(s.id);
        expect(r.lines.length).toBeGreaterThan(2);
      }
    });
  }
});

describe("juju status", () => {
  test("--model picks the section and navigates to it", () => {
    const r = execute("juju status --model experience", { ...ctx, current: "projects" });
    expect(r.lines[1].text).toMatch(/^minh\s+experience\s+microk8s/);
    expect(r.effects.switchTo).toBe("experience");
    expect(r.lines.some((l) => l.text.includes("canonical"))).toBe(true);
  });

  test("accepts -m and --model=", () => {
    expect(execute("juju status -m skills", ctx).effects.switchTo).toBe("skills");
    expect(execute("juju status --model=contact", ctx).effects.switchTo).toBe("contact");
  });

  test("navigates even when the model is already current", () => {
    expect(execute("juju status --model experience", ctx).effects.switchTo).toBe("experience");
  });

  test("plain juju status (no model) shows the current section and scrolls to it", () => {
    expect(execute("juju status", ctx).effects.switchTo).toBe("experience");
  });

  test("rejects an unknown model", () => {
    const r = execute("juju status --model nope", ctx);
    expect(r.lines[0].kind).toBe("err");
    expect(r.effects.switchTo).toBeUndefined();
  });

  test("renders a header for every section", () => {
    for (const current of ["login", "experience", "projects", "skills", "contact"]) {
      const r = execute("juju status", { ...ctx, current });
      expect(r.lines[0].text).toMatch(/^Model\s+Controller\s+Cloud\/Region/);
      expect(r.lines.length).toBeGreaterThan(3);
    }
  });
});

describe("terraform and gh", () => {
  test("terraform plan lists every project and the plan summary", () => {
    const r = execute("terraform plan -target=module.projects", ctx);
    expect(r.effects.switchTo).toBe("projects");
    expect(r.lines.at(-1).text).toMatch(/^Plan: \d+ to add, 0 to change, 0 to destroy\.$/);
    expect(r.lines.filter((l) => /^\s+\+ resource/.test(l.text)).length).toBeGreaterThanOrEqual(4);
  });

  test("terraform apply is refused politely", () => {
    const r = execute("terraform apply", ctx);
    expect(r.lines[0].kind).toBe("err");
    expect(r.effects).toEqual({});
  });

  test("gh run view shows the pipeline; other gh commands fail", () => {
    expect(execute("gh run view build-minh", ctx).effects.switchTo).toBe("skills");
    expect(execute("gh pr list", ctx).lines[0].kind).toBe("err");
  });

  test("juju expose only knows contact", () => {
    expect(execute("juju expose contact", ctx).effects.switchTo).toBe("contact");
    expect(execute("juju expose database", ctx).lines[0].kind).toBe("err");
  });
});

describe("builtins", () => {
  test("unknown commands fail like bash", () => {
    const r = execute("frobnicate", ctx);
    expect(r.lines[0]).toEqual({ kind: "err", text: "bash: frobnicate: command not found" });
  });

  test("clear only clears", () => {
    expect(execute("clear", ctx)).toEqual({ lines: [], effects: { clear: true } });
  });

  test("theme validates its argument", () => {
    expect(execute("theme light", ctx).effects.theme).toBe("light");
    expect(execute("theme neon", ctx).lines[0].kind).toBe("err");
    expect(execute("theme", ctx).lines[0].text).toBe("system");
  });

  test("empty input does nothing", () => {
    expect(execute("", ctx)).toEqual({ lines: [], effects: {} });
  });
});
