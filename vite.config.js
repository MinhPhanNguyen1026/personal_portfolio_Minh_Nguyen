import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "node:child_process";

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

export default defineConfig({
  base: BASE,
  plugins: [react()],
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
