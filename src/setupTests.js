import "@testing-library/jest-dom";
import { vi } from "vitest";

// The deploy-status hook fetches from the GitHub API on mount. Tests must
// not touch the network; a rejected fetch exercises the build-time fallback.
vi.stubGlobal(
  "fetch",
  vi.fn(() => Promise.reject(new Error("network disabled in tests")))
);

// jsdom lacks these; the app guards every use, but stubbing keeps the
// console clean and lets tests assert on scroll/focus behaviour.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}
