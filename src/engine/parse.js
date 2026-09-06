// Tokenise a command line the way a shell would, minus the parts nobody
// needs here: single/double quotes group words, backslash escapes the next
// character, everything else splits on whitespace.

export function tokenize(input) {
  const tokens = [];
  let cur = "";
  let quote = null;
  let hasToken = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (quote) {
      if (ch === quote) {
        quote = null;
      } else if (ch === "\\" && i + 1 < input.length) {
        cur += input[++i];
      } else {
        cur += ch;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      hasToken = true;
    } else if (ch === "\\" && i + 1 < input.length) {
      cur += input[++i];
      hasToken = true;
    } else if (/\s/.test(ch)) {
      if (hasToken) {
        tokens.push(cur);
        cur = "";
        hasToken = false;
      }
    } else {
      cur += ch;
      hasToken = true;
    }
  }
  if (hasToken) tokens.push(cur);
  return tokens;
}

export function parse(input) {
  const tokens = tokenize(String(input ?? "").trim());
  if (tokens.length === 0) return null;
  const [cmd, ...args] = tokens;
  return { cmd, args, raw: input.trim() };
}
