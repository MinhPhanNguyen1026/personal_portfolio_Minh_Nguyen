import { render, screen } from "@testing-library/react";
import App from "./App";
import { PROFILE } from "./data/profile";

test("renders the profile name as the page heading", () => {
  render(<App />);
  expect(screen.getByRole("heading", { level: 1, name: PROFILE.name })).toBeInTheDocument();
});

test("exposes a main landmark and a skip link", () => {
  render(<App />);
  expect(screen.getByRole("main")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /skip to content/i })).toHaveAttribute("href", "#main");
});
