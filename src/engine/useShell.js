import { useCallback, useRef, useState } from "react";
import { execute } from "./commands";

// The one dispatch path. Nav buttons and the terminal input both call
// run(); the engine describes effects and this hook applies them.
//
//   run(cmd)      execute, append to the transcript, apply effects
//   history       [{ id, cmd, lines }] oldest first
//   clear()       empty the transcript
//   recall(dir)   previous/next command for arrow-key history

let seq = 0;

export function useShell({ current, theme, loggedIn, switchTo, setTheme, onLogin, onLogout }) {
  const [history, setHistory] = useState([]);
  const commands = useRef([]);
  const cursor = useRef(-1);

  const run = useCallback(
    (cmd) => {
      const input = String(cmd ?? "").trim();
      if (!input) return;

      const { lines, effects } = execute(input, { current, theme, loggedIn });

      if (effects.clear) {
        setHistory([]);
      } else {
        setHistory((h) => [...h, { id: ++seq, cmd: input, lines }]);
      }

      commands.current.push(input);
      cursor.current = commands.current.length;

      if (effects.theme) setTheme(effects.theme);
      if (effects.login) onLogin?.();
      if (effects.logout) onLogout?.();
      if (effects.switchTo) switchTo(effects.switchTo, { focus: !effects.login && !effects.logout });
    },
    [current, theme, loggedIn, switchTo, setTheme, onLogin, onLogout]
  );

  const clear = useCallback(() => setHistory([]), []);

  const recall = useCallback((dir) => {
    const list = commands.current;
    if (!list.length) return "";
    cursor.current = Math.max(0, Math.min(list.length, cursor.current + dir));
    return list[cursor.current] ?? "";
  }, []);

  return { history, run, clear, recall };
}
