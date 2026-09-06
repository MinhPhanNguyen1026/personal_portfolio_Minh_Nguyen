import { useEffect, useState } from "react";
import { PROFILE } from "../data/profile";

// The status bar's deploy pill shows a *real* value: the commit of the
// last successful deploy, from the GitHub Actions API. If that fails
// (offline, rate-limited, adblocked), it falls back to the SHA baked in
// at build time — still true, just less fresh. Never a placeholder.

/* global __BUILD_SHA__, __BUILD_TIME__ */
const BUILD = {
  sha: typeof __BUILD_SHA__ === "string" ? __BUILD_SHA__ : "unknown",
  at: typeof __BUILD_TIME__ === "string" ? __BUILD_TIME__ : null,
};

const CACHE_KEY = "portfolio.deploy";
const CACHE_TTL = 10 * 60 * 1000;
const { owner, name } = PROFILE.repo;
const API = `https://api.github.com/repos/${owner}/${name}/actions/workflows/deploy.yml/runs?status=success&per_page=1`;

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

export function relativeTime(iso) {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export function useDeployStatus() {
  const [status, setStatus] = useState(() => ({
    sha: BUILD.sha,
    at: BUILD.at,
    source: "build",
    url: `https://github.com/${owner}/${name}/commit/${BUILD.sha}`,
  }));

  useEffect(() => {
    const cached = fromCache();
    if (cached) {
      setStatus(cached);
      return undefined;
    }
    const ctrl = new AbortController();
    fetch(API, { signal: ctrl.signal, headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        const run = data?.workflow_runs?.[0];
        if (!run) return;
        const value = {
          sha: run.head_sha.slice(0, 7),
          at: run.updated_at,
          source: "actions",
          url: run.html_url,
        };
        toCache(value);
        setStatus(value);
      })
      .catch(() => {
        /* keep the build-time fallback */
      });
    return () => ctrl.abort();
  }, []);

  return status;
}
