import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BASE_PATH=/brick-by-brick-site/ for GitHub Pages; "/" for Vercel and local.
export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react()],
  build: { target: "es2020", assetsInlineLimit: 0 },
});
