import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from GitHub Pages under the repo name, so every asset URL needs
// this prefix. Vite rewrites <link>/<script> paths in index.html and
// import.meta.env.BASE_URL exposes it to the app for public/ files.
const BASE = "/personal_portfolio_Minh_Nguyen/";

export default defineConfig({
  base: BASE,
  plugins: [react()],
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
