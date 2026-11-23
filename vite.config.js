import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { handleContactRequest } from "./server/contactHandler.js";

const SERVER_ENV_KEYS = [
  "BREVO_API_KEY",
  "CONTACT_TO_EMAIL",
  "CONTACT_FROM_EMAIL",
  "CONTACT_FROM_NAME",
];

function contactApiPlugin() {
  function attach(server) {
    server.middlewares.use("/api/contact", (req, res, next) => {
      const path = (req.url || "/").split("?")[0];
      if (path !== "" && path !== "/") {
        next();
        return;
      }

      handleContactRequest(req, res).catch((error) => {
        console.error("[contact] dev middleware error:", error);
        if (!res.headersSent) {
          res.writeHead(500, { "Content-Type": "application/json" });
        }
        res.end(JSON.stringify({ ok: false, error: "Unexpected error." }));
      });
    });
  }

  return {
    name: "portfolio-contact-api",
    configureServer: attach,
    configurePreviewServer: attach,
  };
}

export default defineConfig(({ mode }) => {
  // Load every .env value (not just VITE_*) so the server-side handler can read
  // the Brevo key without ever exposing it to the client bundle.
  const env = loadEnv(mode, process.cwd(), "");
  for (const key of SERVER_ENV_KEYS) {
    if (env[key] && !process.env[key]) process.env[key] = env[key];
  }

  return {
    plugins: [react(), tailwindcss(), contactApiPlugin()],
  };
});
