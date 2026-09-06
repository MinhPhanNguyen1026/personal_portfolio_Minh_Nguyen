import { useRef, useState } from "react";
import CommandBox, { canAnimate } from "./CommandBox";
import { useStartWhenVisible } from "../../hooks/useStartWhenVisible";
import styles from "./Bridge.module.css";

// The muted command/response pairs between sections. Each step types its
// command on scroll, then its output prints — same mechanics as a
// section, none of the emphasis. Decorative for assistive tech: the
// container is aria-hidden and nothing here is information that isn't
// elsewhere on the page.

function Step({ step }) {
  const box = useRef(null);
  const out = useRef(null);
  const [ready, setReady] = useState(() => !canAnimate());
  useStartWhenVisible(out, box);

  return (
    <div className={styles.step} data-ready={ready ? "true" : "false"}>
      <CommandBox ref={box} command={step.cmd} quiet onTyped={() => setReady(true)} onReset={() => setReady(false)} />
      {step.out.length ? (
        <div ref={out} className={styles.out}>
          {step.out.map((line, i) => (
            <div key={i} className={styles.line} data-print>
              {line || " "}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function Bridge({ steps }) {
  return (
    <div className={styles.bridge} aria-hidden="true" data-bridge>
      <div className={styles.inner}>
        {steps.map((step, i) => (
          <Step key={i} step={step} />
        ))}
      </div>
    </div>
  );
}
