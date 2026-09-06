import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_SECTION, SECTIONS, findSection } from "../engine/sections";

// Owns "where am I": the active section id, kept in sync with the URL
// hash and with scroll position. switchTo() is the only way to move
// deliberately; scrolling just updates the readout.

function fromHash() {
  const id = window.location.hash.replace(/^#/, "");
  return findSection(id) ? id : DEFAULT_SECTION;
}

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export function useSection() {
  const [current, setCurrent] = useState(fromHash);
  // While a programmatic scroll is in flight, ignore observer updates so
  // the readout doesn't flicker through the sections it scrolls past.
  const settling = useRef(null);

  const switchTo = useCallback((id, { focus = true } = {}) => {
    const section = findSection(id);
    if (!section) return;
    setCurrent(section.id);

    const el = document.getElementById(section.id);
    if (!el) return;

    if (window.location.hash !== `#${section.id}`) {
      window.history.pushState(null, "", `#${section.id}`);
    }

    clearTimeout(settling.current);
    settling.current = setTimeout(() => (settling.current = null), 700);

    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });

    if (focus) {
      const heading = el.querySelector("[data-section-heading]");
      if (heading) heading.focus({ preventScroll: true });
    }
  }, []);

  // Deep links: the browser's own hash-jump fires before React has
  // rendered the target, so it lands on nothing. Repeat it once the DOM
  // exists — instantly, without focus, so it feels like a normal page load.
  useEffect(() => {
    const id = fromHash();
    if (id === DEFAULT_SECTION) return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Back/forward and manual hash edits.
  useEffect(() => {
    const onHash = () => setCurrent(fromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Scroll tracking: the section covering the top band of the viewport is
  // current. rootMargin pushes the band below the fixed status bar.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        if (settling.current) return;
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = visible[0].target.id;
          setCurrent(id);
          if (window.location.hash !== `#${id}`) window.history.replaceState(null, "", `#${id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.01, 0.5] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return { current, switchTo };
}
