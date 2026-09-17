import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/postcss";
import { fileURLToPath } from "node:url";
import { aiDocsUtf8 } from "./ai-docs-plugin";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "./",
  plugins: [react(), aiDocsUtf8()],
  css: { postcss: { plugins: [tailwindcss()] } },
  build: { outDir: "../showcase-dist", emptyOutDir: true },
});
