import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../App";

// The contract of the whole theme: clicking a section button runs the
// same command a person could type, and the terminal shows it.

// The drawer starts collapsed on narrow viewports (which is what the
// matchMedia stub reports), and a collapsed drawer hides its log and
// input from the accessibility tree. Expand it the way a person would.
async function openTerminal() {
  await userEvent.click(screen.getByRole("button", { name: /expand terminal/i }));
}

test("nav buttons run `juju switch` and the terminal records it", async () => {
  render(<App />);
  await openTerminal();

  const nav = screen.getByRole("navigation", { name: /sections/i });
  const projects = within(nav).getByRole("button", { name: "projects" });
  await userEvent.click(projects);

  const log = screen.getByRole("log");
  expect(within(log).getByText("juju switch projects")).toBeInTheDocument();
  expect(within(log).getByText(/minh:admin\/login -> minh:admin\/projects/)).toBeInTheDocument();
  expect(projects).toHaveAttribute("aria-current", "true");
  expect(window.location.hash).toBe("#projects");
});

test("typing in the terminal goes through the same engine", async () => {
  render(<App />);
  await openTerminal();

  const input = screen.getByRole("textbox", { name: /command input/i });
  await userEvent.type(input, "juju switch skills{enter}");

  const log = screen.getByRole("log");
  expect(within(log).getByText("juju switch skills")).toBeInTheDocument();
  expect(within(screen.getByRole("navigation", { name: /sections/i })).getByRole("button", { name: "skills" })).toHaveAttribute(
    "aria-current",
    "true"
  );
});

test("unknown commands fail like bash and do not navigate", async () => {
  render(<App />);
  await openTerminal();
  const before = window.location.hash;

  const input = screen.getByRole("textbox", { name: /command input/i });
  await userEvent.type(input, "rm -rf /{enter}");

  expect(within(screen.getByRole("log")).getByText("bash: rm: command not found")).toBeInTheDocument();
  expect(window.location.hash).toBe(before);
});

test("theme button cycles system → light → dark and stamps the root", async () => {
  render(<App />);
  const btn = screen.getByRole("button", { name: /^theme: system/i });
  await userEvent.click(btn);
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  await userEvent.click(screen.getByRole("button", { name: /^theme: light/i }));
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  await userEvent.click(screen.getByRole("button", { name: /^theme: dark/i }));
  expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
});
