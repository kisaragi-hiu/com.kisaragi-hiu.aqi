import legacy from "@vitejs/plugin-legacy";
import { defineConfig } from "vite";
export default defineConfig({
  clearScreen: false,
  publicDir: "static",
  build: {
    outDir: "dist",
  },
  plugins: [legacy({ targets: ["> 0.05%"] })],
});
