import { useState } from "react";
import { PROFILE } from "../../data/profile";
import styles from "./PromptLine.module.css";

// The live prompt: one fixed line at the bottom of the viewport, where a
// terminal's prompt lives. Whatever is typed here goes through the same
// run() as every button on the page. Output lands in the Transcript
// section at the end of the page; section commands scroll to their
// section instead.

export const PROMPT_INPUT_ID = "prompt-input";

export default function PromptLine({ run, recall, current }) {
  const [value, setValue] = useState("");

  function onKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setValue(recall(-1));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setValue(recall(1));
    } else if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  }

  return (
    // A named form is a landmark, so the prompt is reachable by landmark
    // navigation and axe's "all content in a landmark" rule is satisfied.
    <form className={styles.bar} aria-label="Command prompt" onSubmit={(e) => e.preventDefault()}>
      <label className={styles.line}>
        <span className={styles.prompt} aria-hidden="true">
          <span className={styles.host}>
            {PROFILE.handle}@{PROFILE.host}
          </span>
          <span className={styles.path}>:~/{current}</span>$
        </span>
        <span className="sr-only">Command input</span>
        <input
          id={PROMPT_INPUT_ID}
          className={styles.input}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="type help, or press /"
          aria-describedby="prompt-hint"
        />
      </label>
      <span id="prompt-hint" className="sr-only">
        Output appears in the Transcript section at the end of the page. Section commands scroll to their section.
      </span>
    </form>
  );
}
