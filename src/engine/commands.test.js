import { execute, switchCommand } from "./commands";
import { tokenize } from "./parse";

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

  test("rejects unknown controllers and the login pseudo-controller", () => {
    expect(execute("juju switch nope", ctx).lines[0].kind).toBe("err");
    expect(execute("juju switch login", ctx).effects.switchTo).toBeUndefined();
  });

  test("is a no-op when already on the target", () => {
    const r = execute("juju switch experience", ctx);
    expect(r.effects.switchTo).toBeUndefined();
    expect(r.lines[0].kind).toBe("muted");
  });

  test("switchCommand is what the nav buttons run", () => {
    expect(execute(switchCommand("skills"), ctx).effects.switchTo).toBe("skills");
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

  test("juju status renders a header for every section", () => {
    for (const current of ["login", "experience", "projects", "skills", "contact"]) {
      const r = execute("juju status", { ...ctx, current });
      expect(r.lines[0].text).toMatch(/^Model\s+Controller\s+Cloud\/Region/);
      expect(r.lines.length).toBeGreaterThan(3);
    }
  });

  test("empty input does nothing", () => {
    expect(execute("", ctx)).toEqual({ lines: [], effects: {} });
  });
});
