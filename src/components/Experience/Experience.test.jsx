import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Experience from "./Experience";
import { ALL_EXPERIENCE, CURRENT_ROLES } from "../../data/experience";

test("renders every role as a row with the juju status columns", () => {
  render(<Experience />);
  const table = screen.getByRole("table");
  for (const col of ["App", "Version", "Status", "Charm", "Message"]) {
    expect(within(table).getByRole("columnheader", { name: col })).toBeInTheDocument();
  }
  for (const role of ALL_EXPERIENCE) {
    expect(within(table).getByRole("button", { name: role.app })).toBeInTheDocument();
  }
});

test("current roles are active; past roles are terminated", () => {
  render(<Experience />);
  const active = screen.getAllByText("active");
  expect(active).toHaveLength(CURRENT_ROLES.length);
  expect(screen.getAllByText("terminated").length).toBeGreaterThan(0);
});

test("a row expands to show details and collapses again", async () => {
  render(<Experience />);
  const btn = screen.getByRole("button", { name: "onc-ai" });
  expect(btn).toHaveAttribute("aria-expanded", "false");

  await userEvent.click(btn);
  expect(btn).toHaveAttribute("aria-expanded", "true");
  const details = document.getElementById(btn.getAttribute("aria-controls"));
  expect(details).toBeVisible();
  expect(within(details).getByRole("link", { name: /onc\.ai/i })).toHaveAttribute("href", "https://onc.ai/");
  expect(within(within(details).getByRole("list", { name: /platforms and tools/i })).getByText("GCP")).toBeInTheDocument();

  await userEvent.click(btn);
  expect(btn).toHaveAttribute("aria-expanded", "false");
  expect(details).not.toBeVisible();
});

test("only one row is open at a time", async () => {
  render(<Experience />);
  await userEvent.click(screen.getByRole("button", { name: "onc-ai" }));
  await userEvent.click(screen.getByRole("button", { name: "salesforce" }));
  expect(screen.getByRole("button", { name: "onc-ai" })).toHaveAttribute("aria-expanded", "false");
  expect(screen.getByRole("button", { name: "salesforce" })).toHaveAttribute("aria-expanded", "true");
});
