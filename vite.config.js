import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "node:child_process";
import { PROFILE } from "./src/data/profile.js";

// Served from GitHub Pages under the repo name, so every asset URL needs
// this prefix. Vite rewrites <link>/<script> paths in index.html and
// import.meta.env.BASE_URL exposes it to the app for public/ files.
const BASE = "/personal_portfolio_Minh_Nguyen/";

// The commit this build came from. GitHub Actions provides GITHUB_SHA;
// locally we ask git. This is the status bar's fallback when the GitHub
// API is unavailable, so the deploy pill never shows a made-up value.
function buildSha() {
  const fromCi = process.env.GITHUB_SHA;
  if (fromCi) return fromCi.slice(0, 7);
  try {
    return execSync("git rev-parse --short=7 HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "unknown";
  }
}

// SEO tags and the JSON-LD Person schema are generated from
// src/data/profile.js at build time so there's one source of truth for
// who the site is about. Edit profile.js, not index.html.
function seo() {
  const description = `${PROFILE.name} is a ${PROFILE.title.toLowerCase()} at ${PROFILE.employer.name} working across platform engineering and web development. Experience, projects, and skills, presented as a control plane you can navigate.`;
  const image = `${PROFILE.siteUrl}og.png`;

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PROFILE.name,
    givenName: PROFILE.firstName,
    familyName: PROFILE.lastName,
    jobTitle: PROFILE.title,
    worksFor: { "@type": "Organization", name: PROFILE.employer.name, url: PROFILE.employer.href },
    alumniOf: { "@type": "CollegeOrUniversity", name: PROFILE.education.school, url: PROFILE.education.href },
    url: PROFILE.siteUrl,
    image,
    sameAs: PROFILE.links.filter((l) => l.external).map((l) => l.href),
    address: { "@type": "PostalAddress", addressLocality: "Rochester", addressRegion: "NY", addressCountry: "US" },
  };

  const tags = [
    { tag: "meta", attrs: { name: "description", content: description } },
    { tag: "meta", attrs: { property: "og:type", content: "profile" } },
    { tag: "meta", attrs: { property: "og:title", content: `${PROFILE.name} — ${PROFILE.title}` } },
    { tag: "meta", attrs: { property: "og:description", content: description } },
    { tag: "meta", attrs: { property: "og:url", content: PROFILE.siteUrl } },
    { tag: "meta", attrs: { property: "og:image", content: image } },
    { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
    { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
    { tag: "meta", attrs: { property: "og:image:alt", content: `${PROFILE.name}'s portfolio, styled as a terminal login` } },
    { tag: "meta", attrs: { property: "profile:first_name", content: PROFILE.firstName } },
    { tag: "meta", attrs: { property: "profile:last_name", content: PROFILE.lastName } },
    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
    { tag: "meta", attrs: { name: "twitter:title", content: `${PROFILE.name} — ${PROFILE.title}` } },
    { tag: "meta", attrs: { name: "twitter:description", content: description } },
    { tag: "meta", attrs: { name: "twitter:image", content: image } },
    { tag: "script", attrs: { type: "application/ld+json" }, children: JSON.stringify(person) },
  ];

  return {
    name: "portfolio-seo",
    transformIndexHtml: () => tags.map((t) => ({ ...t, injectTo: "head" })),
  };
}

export default defineConfig({
  base: BASE,
  plugins: [react(), seo()],
  define: {
    __BUILD_SHA__: JSON.stringify(buildSha()),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    target: "es2020",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    css: false,
  },
});
