import { useEffect, useState } from "react";

// Live star counts and languages for the open-source repos, from the
// GitHub API, with the static values from opensource.js as the fallback.
// One request per repo, cached for the session so repeat visits within
// the unauthenticated rate limit don't re-fetch.

const CACHE_KEY = "portfolio.repos";
const CACHE_TTL = 30 * 60 * 1000;

function fromCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Date.now() - parsed.fetchedAt < CACHE_TTL ? parsed.value : null;
  } catch {
    return null;
  }
}

function toCache(value) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), value }));
  } catch {
    /* ignore */
  }
}

export function useRepoStats(repos) {
  const [stats, setStats] = useState(() => Object.fromEntries(repos.map((r) => [r.fullName, { stars: r.stars, language: r.language, live: false }])));

  useEffect(() => {
    const cached = fromCache();
    if (cached) {
      setStats((s) => ({ ...s, ...cached }));
      return undefined;
    }
    const ctrl = new AbortController();
    Promise.all(
      repos.map((r) =>
        fetch(`https://api.github.com/repos/${r.fullName}`, { signal: ctrl.signal, headers: { Accept: "application/vnd.github+json" } })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => (data ? [r.fullName, { stars: data.stargazers_count, language: data.language ?? r.language, live: true }] : null))
          .catch(() => null)
      )
    ).then((entries) => {
      const value = Object.fromEntries(entries.filter(Boolean));
      if (Object.keys(value).length) {
        toCache(value);
        setStats((s) => ({ ...s, ...value }));
      }
    });
    return () => ctrl.abort();
    // repos is a module constant
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return stats;
}
