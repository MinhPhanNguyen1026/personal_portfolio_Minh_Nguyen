import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../App";
import { SESSION_KEY } from "./Login";
import { PROFILE } from "../../data/profile";

beforeEach(() => {
  sessionStorage.clear();
  window.history.replaceState(null, "", "/");
});

test("starts locked: the card shows, and the h1 is still in the document", () => {
  render(<App />);
  expect(screen.getByRole("dialog", { name: /log in to minh-portfolio/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { level: 1, name: PROFILE.name })).toBeInTheDocument();
});

test("there is no skip button; Log in is the only control", () => {
  render(<App />);
  const dialog = screen.getByRole("dialog");
  expect(within(dialog).getAllByRole("button")).toHaveLength(1);
  expect(within(dialog).getByRole("button", { name: /log in as minh/i })).toHaveFocus();
});

test("Log in auto-types the credentials and then opens", () => {
  vi.useFakeTimers();
  try {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /log in as minh/i }));
    expect(screen.getByRole("button", { name: /authenticating/i })).toBeDisabled();

    // The password typewriter is scheduled by an effect that runs only
    // after React commits the username's completion, so advance in
    // steps rather than one jump.
    for (let i = 0; i < 16; i++) {
      act(() => {
        vi.advanceTimersByTime(300);
      });
    }

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(sessionStorage.getItem(SESSION_KEY)).toBe("1");
  } finally {
    vi.useRealTimers();
  }
});

test("a deep link skips the login entirely", () => {
  window.history.replaceState(null, "", "/#projects");
  render(<App />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("a returning visitor in the same session is not asked again", () => {
  sessionStorage.setItem(SESSION_KEY, "1");
  render(<App />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("`juju logout` locks the hero again", async () => {
  sessionStorage.setItem(SESSION_KEY, "1");
  render(<App />);
  await userEvent.click(screen.getByRole("button", { name: /expand terminal/i }));
  await userEvent.type(screen.getByRole("textbox", { name: /command input/i }), "juju logout{enter}");
  expect(screen.getByRole("dialog", { name: /log in/i })).toBeInTheDocument();
  expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
  expect(within(screen.getByRole("log")).getByText(/logged out of minh/i)).toBeInTheDocument();
});

test("Escape opens the MOTD, remembers the session, and focuses the name", () => {
  render(<App />);
  fireEvent.keyDown(window, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(sessionStorage.getItem(SESSION_KEY)).toBe("1");
  expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();
});
