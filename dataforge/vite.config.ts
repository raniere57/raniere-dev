import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Demo estático servido em raniere.dev/dataforge/ (GitHub Pages, subpath).
// viteSingleFile inlina tudo num index.html — sem assets externos além das fontes.
export default defineConfig({
  base: "/dataforge/",
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    // Respeita a porta atribuída pelo ambiente (PORT); 5177 como padrão.
    port: Number(process.env.PORT) || 5177,
  },
});
