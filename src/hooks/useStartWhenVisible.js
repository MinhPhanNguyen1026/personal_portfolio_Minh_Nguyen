import { useEffect } from "react";

// If a block of output reaches the viewport before its prompt was seen
// (fast scrolling), start the prompt typing anyway so the output is never
// stuck unwritten. `boxRef.current.start()` is a no-op once started.

export function useStartWhenVisible(bodyRef, boxRef) {
  useEffect(() => {
    const el = bodyRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) boxRef.current?.start();
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [bodyRef, boxRef]);
}
