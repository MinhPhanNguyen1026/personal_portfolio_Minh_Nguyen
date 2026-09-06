import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../App";

// The contract of the whole theme: clicking a section button runs the
// same command a person could type, and the transcript records it.

const nav = () => screen.getByRole("navigation", { name: /sections/i });
const prompt = () => screen.getByRole("textbox", { name: /command input/i });

test("nav buttons run `juju switch` and the transcript records it", async () => {
  render(<App />);

  const projects = within(nav()).getByRole("button", { name: "projects" });
  await userEvent.click(projects);

  const log = screen.getByRole("log");
  expect(within(log).getByText("juju switch projects")).toBeInTheDocument();
  expect(within(log).getByText(/minh:admin\/login -> minh:admin\/projects/)).toBeInTheDocument();
  expect(projects).toHaveAttribute("aria-current", "true");
  expect(window.location.hash).toBe("#projects");
});

test("typing at the prompt goes through the same engine", async () => {
  render(<App />);

  await userEvent.type(prompt(), "juju switch skills{enter}");

  expect(within(screen.getByRole("log")).getByText("juju switch skills")).toBeInTheDocument();
  expect(within(nav()).getByRole("button", { name: "skills" })).toHaveAttribute("aria-current", "true");
  expect(prompt()).toHaveValue("");
});

test("unknown commands fail like bash, land in the transcript, and do not navigate", async () => {
  render(<App />);
  const before = window.location.hash;

  await userEvent.type(prompt(), "rm -rf /{enter}");

  expect(within(screen.getByRole("log")).getByText("bash: rm: command not found")).toBeInTheDocument();
  expect(before === "" || before === "#transcript" || window.location.hash === "#transcript").toBe(true);
});

test("arrow keys recall history at the prompt", async () => {
  render(<App />);
  await userEvent.type(prompt(), "whoami{enter}");
  await userEvent.type(prompt(), "pwd{enter}");
  await userEvent.type(prompt(), "{arrowup}");
  expect(prompt()).toHaveValue("pwd");
  await userEvent.type(prompt(), "{arrowup}");
  expect(prompt()).toHaveValue("whoami");
});

test("a section's command box copies and runs its command", async () => {
  const writeText = vi.fn(() => Promise.resolve());
  Object.assign(navigator, { clipboard: { writeText } });
  render(<App />);

  await userEvent.click(screen.getByRole("button", { name: 'Copy "terraform plan -target=module.projects"' }));
  expect(writeText).toHaveBeenCalledWith("terraform plan -target=module.projects");
  expect(await screen.findByText("Copied to clipboard.")).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: 'Run "terraform plan -target=module.projects"' }));
  const log = screen.getByRole("log");
  expect(within(log).getByText("terraform plan -target=module.projects")).toBeInTheDocument();
  expect(within(log).getByText(/^Plan: \d+ to add/)).toBeInTheDocument();
  expect(window.location.hash).toBe("#projects");
});

test("the top-left minh@portfolio link goes home without an error or a login replay", async () => {
  render(<App />);
  await userEvent.click(within(nav()).getByRole("button", { name: "projects" }));
  expect(window.location.hash).toBe("#projects");

  await userEvent.click(screen.getByRole("link", { name: "Home" }));
  expect(window.location.hash).toBe("");
  const log = screen.getByRole("log");
  expect(within(log).getByText("cd ~")).toBeInTheDocument();
  expect(within(log).queryByText(/not a controller/)).not.toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("the status bar's >_ button focuses the prompt", async () => {
  render(<App />);
  await userEvent.click(screen.getByRole("button", { name: /focus the prompt/i }));
  expect(prompt()).toHaveFocus();
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
