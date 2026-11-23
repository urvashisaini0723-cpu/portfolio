import "dotenv/config";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { handleContactRequest } from "./contactHandler.js";

const PORT = Number(process.env.PORT) || 3000;
const DIST_DIR = resolve(process.cwd(), "dist");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "X-Content-Type-Options": "nosniff",
    ...headers,
  });
  res.end(body);
}

function sendJson(res, status, body) {
  send(res, status, JSON.stringify(body), {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
}

async function serveStatic(req, res, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    send(res, 400, "Bad request");
    return;
  }

  if (decoded.includes("\0")) {
    send(res, 400, "Bad request");
    return;
  }

  const requested = decoded.endsWith("/") ? `${decoded}index.html` : decoded;
  let filePath = resolve(DIST_DIR, `.${requested}`);

  if (filePath !== DIST_DIR && !filePath.startsWith(`${DIST_DIR}${sep}`)) {
    send(res, 403, "Forbidden");
    return;
  }

  let fileStat;
  try {
    fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      filePath = resolve(filePath, "index.html");
      fileStat = await stat(filePath);
    }
  } catch {
    // Unknown paths without an extension fall back to the SPA entry point.
    if (extname(decoded)) {
      send(res, 404, "Not found");
      return;
    }
    filePath = resolve(DIST_DIR, "index.html");
    try {
      fileStat = await stat(filePath);
    } catch {
      send(
        res,
        503,
        "Build not found. Run `npm run build` before `npm start`.",
      );
      return;
    }
  }

  const ext = extname(filePath).toLowerCase();
  const isHashedAsset =
    filePath.includes(`${sep}assets${sep}`) && /\.[a-z0-9]{6,}\./i.test(filePath);

  const headers = {
    "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
    "Content-Length": fileStat.size,
    "Cache-Control": isHashedAsset
      ? "public, max-age=31536000, immutable"
      : ext === ".html"
        ? "no-cache"
        : "public, max-age=3600",
  };

  if (req.method === "HEAD") {
    send(res, 200, "", headers);
    return;
  }

  try {
    const content = await readFile(filePath);
    send(res, 200, content, headers);
  } catch {
    send(res, 500, "Could not read file");
  }
}

const server = createServer(async (req, res) => {
  let pathname;
  try {
    pathname = new URL(
      req.url || "/",
      `http://${req.headers.host || "localhost"}`,
    ).pathname;
  } catch {
    send(res, 400, "Bad request");
    return;
  }

  if (pathname === "/api/contact") {
    await handleContactRequest(req, res);
    return;
  }

  if (pathname === "/api/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    sendJson(res, 405, { ok: false, error: "Method not allowed." });
    return;
  }

  await serveStatic(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});
