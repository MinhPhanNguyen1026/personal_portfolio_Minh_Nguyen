import { render, screen } from "@testing-library/react";
import App from "./App";
import { PROFILE } from "./data/profile";

test("renders the profile name as the page heading", () => {
  render(<App />);
  expect(screen.getByRole("heading", { level: 1, name: PROFILE.name })).toBeInTheDocument();
});

test("bridges between sections are present, in order, and hidden from assistive tech", () => {
  render(<App />);
  const bridges = document.querySelectorAll("[data-bridge]");
  expect(bridges).toHaveLength(5);
  bridges.forEach((b) => expect(b).toHaveAttribute("aria-hidden", "true"));
  expect(bridges[0].textContent).toContain("juju models");
  expect(bridges[1].textContent).toContain("terraform init");
  expect(bridges[4].textContent).toContain("history");
});

test("exposes a main landmark and a skip link", () => {
  render(<App />);
  expect(screen.getByRole("main")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /skip to content/i })).toHaveAttribute("href", "#main");
});
