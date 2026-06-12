import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Demo estático servido em raniere.dev/sigma/ (GitHub Pages, subpath).
export default defineConfig({
  base: "/sigma/",
  plugins: [react()],
});
