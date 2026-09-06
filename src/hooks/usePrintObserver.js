import { useEffect } from "react";

// The page prints as you scroll. Every unit of output — a status row, a
// project, a pipeline stage, a line of the MOTD — carries `data-print`.
// This observer marks each one `data-printed` as it enters the viewport,
// staggering units that arrive in the same frame so a block cascades in
// like terminal output. CSS does the rest (see base.css), and only when
// the unit's section is ready, i.e. its command has finished typing.
//
// Nothing here runs under prefers-reduced-motion or without
// IntersectionObserver; in those cases the CSS never hides anything.

export function usePrintObserver(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return undefined;
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    } catch {
      /* assume motion is fine */
    }

    const io = new IntersectionObserver(
      (entries) => {
        const hits = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        hits.forEach((e, i) => {
          e.target.style.transitionDelay = `${Math.min(i * 40, 320)}ms`;
          e.target.setAttribute("data-printed", "");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 }
    );

    const observe = (node) => {
      if (!node.hasAttribute("data-printed")) io.observe(node);
    };
    root.querySelectorAll("[data-print]").forEach(observe);

    // Units that appear later — an expanded row, a transcript entry.
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const n of m.addedNodes) {
          if (n.nodeType !== 1) continue;
          if (n.matches?.("[data-print]")) observe(n);
          n.querySelectorAll?.("[data-print]").forEach(observe);
        }
      }
    });
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [rootRef]);
}
