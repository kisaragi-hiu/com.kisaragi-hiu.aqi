import legacy from "@vitejs/plugin-legacy";
import { defineConfig } from "vite";
export default defineConfig({
  clearScreen: false,
  root: "src",
  // These are relative to Vite's root, ie. src/ as set above
  build: {
    publicDir: "static",
    outDir: "../dist",
  },
  plugins: [legacy({ targets: ["> 0.05%"] })],
});
