import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_SECTION, SECTIONS, findSection } from "../engine/sections";

// Owns "where am I": the active section id, kept in sync with the URL
// hash and with scroll position. switchTo() is the only way to move
// deliberately; scrolling just updates the readout.
//
// The readout is *computed from the scroll position* on every scroll
// frame rather than inferred from intersection events. Event-based
// tracking could miss a transition (fast scroll, a suppressed window) and
// then had no way to notice it was wrong; a pure function of scrollY has
// no memory to get stuck in.

const LAST_SECTION = SECTIONS[SECTIONS.length - 1].id;
const STATUSBAR_PX = 40;
const PROBE = 0.35; // how far down the viewport the "current" line sits

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

// The last section whose top has passed the probe line. Pinned to the
// first section at the very top of the page and the last at the very
// bottom, so the two ends are never ambiguous.
function sectionAtScroll() {
  const y = window.scrollY;
  const vh = window.innerHeight;
  if (y <= 4) return DEFAULT_SECTION;
  const maxY = document.documentElement.scrollHeight - vh;
  if (y >= maxY - 4) return LAST_SECTION;

  const probe = y + STATUSBAR_PX + vh * PROBE;
  let active = DEFAULT_SECTION;
  for (const s of SECTIONS) {
    const el = document.getElementById(s.id);
    if (!el) continue;
    if (el.getBoundingClientRect().top + y <= probe) active = s.id;
    else break;
  }
  return active;
}

function hashFor(id) {
  return id === DEFAULT_SECTION ? "" : `#${id}`;
}

function replaceHash(id) {
  const want = hashFor(id);
  if (window.location.hash !== want) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search + want);
  }
}

export function useSection() {
  const [current, setCurrent] = useState(fromHash);
  // While a programmatic scroll is in flight, the readout is pinned to
  // the destination instead of flickering through what it scrolls past.
  const pinned = useRef(false);
  const fallback = useRef(null);

  const sync = useCallback(() => {
    const id = sectionAtScroll();
    setCurrent(id);
    replaceHash(id);
  }, []);

  const unpin = useCallback(() => {
    if (!pinned.current) return;
    pinned.current = false;
    clearTimeout(fallback.current);
    sync();
  }, [sync]);

  const switchTo = useCallback(
    (id, { focus = true } = {}) => {
      const section = findSection(id);
      if (!section) return;
      const el = document.getElementById(section.id);
      if (!el) return;

      setCurrent(section.id);
      const want = hashFor(section.id);
      if (window.location.hash !== want) {
        window.history.pushState(null, "", window.location.pathname + window.location.search + want);
      }

      // Always scroll — even when this section is already "current".
      // Current only means the probe line is somewhere inside it, which
      // is exactly when someone mid-section wants to get to its top.
      pinned.current = true;
      clearTimeout(fallback.current);
      fallback.current = setTimeout(unpin, 1500); // for browsers without scrollend
      el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });

      if (focus) {
        el.querySelector("[data-section-heading]")?.focus({ preventScroll: true });
      }
    },
    [unpin]
  );

  useEffect(() => {
    // Deep links: the browser's own hash-jump fires before React has
    // rendered the target. Repeat it instantly now that the DOM exists.
    const initial = fromHash();
    if (initial !== DEFAULT_SECTION) {
      document.getElementById(initial)?.scrollIntoView({ behavior: "auto", block: "start" });
    }

    let raf = 0;
    const onScroll = () => {
      if (pinned.current || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        sync();
      });
    };
    // A person scrolling during a programmatic scroll takes control back.
    const onUserScroll = () => unpin();
    const onHash = () => setCurrent(fromHash());

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("scrollend", unpin);
    window.addEventListener("wheel", onUserScroll, { passive: true });
    window.addEventListener("touchmove", onUserScroll, { passive: true });
    window.addEventListener("hashchange", onHash);
    sync();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scrollend", unpin);
      window.removeEventListener("wheel", onUserScroll);
      window.removeEventListener("touchmove", onUserScroll);
      window.removeEventListener("hashchange", onHash);
    };
  }, [sync, unpin]);

  return { current, switchTo };
}
