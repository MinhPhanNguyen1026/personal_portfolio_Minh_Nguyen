import { defineConfig } from "vite";

// Serves docs/ as a plain static site so the theme board can be viewed
// with the same command shape as the app (`npm run theme`). No plugins,
// no base path — this is deliberately not the app's config.
export default defineConfig({
  root: "docs",
  base: "/",
  publicDir: false,
  server: {
    port: 5174,
    strictPort: true,
    open: "/theme-board.html",
  },
});
