import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// Standalone build for the admin panel, served from the /admin route of the
// portfolio. Shares the same Supabase project as the public site
// (VITE_SUPABASE_* env — frontend-safe, never a secret key).
export default defineConfig(({ mode }) => {
  // Load env from the portfolio root so the admin panel inherits the same
  // Supabase URL/key (locally from .env; on Vercel from dashboard env vars).
  const env = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith("VITE_") && !(key in process.env)) {
      process.env[key] = value;
    }
  }

  return {
    root: resolve(__dirname, "src/adminpanel"),
    base: "/admin/",
    plugins: [react(), tailwindcss()],
    build: {
      outDir: resolve(__dirname, "dist/admin"),
      emptyOutDir: true,
    },
  };
});
