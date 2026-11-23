import { ContactError, sendContactEmail } from "./contactApi.js";

const MAX_BODY_BYTES = 32 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory limiter. It protects the shared Brevo quota from casual
// abuse; serverless deployments get one bucket per warm instance.
const rateBuckets = new Map();

function isRateLimited(key) {
  const now = Date.now();
  const recent = (rateBuckets.get(key) || []).filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    rateBuckets.set(key, recent);
    return true;
  }

  recent.push(now);
  rateBuckets.set(key, recent);

  if (rateBuckets.size > 5000) {
    for (const [bucketKey, times] of rateBuckets) {
      if (!times.some((time) => now - time < RATE_LIMIT_WINDOW_MS)) {
        rateBuckets.delete(bucketKey);
      }
    }
  }

  return false;
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0];
  }
  return req.socket?.remoteAddress || "unknown";
}

// Comma-separated list of browser origins allowed to call the API. Wildcards
// are supported for preview deployments, e.g. "https://portfolio-*.vercel.app".
function allowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:4173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function originMatches(origin, pattern) {
  if (pattern === "*") return true;
  if (!pattern.includes("*")) return origin === pattern;

  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replaceAll("*", ".*");

  return new RegExp(`^${escaped}$`).test(origin);
}

function corsHeaders(req) {
  const origin = req.headers.origin;
  const headers = { Vary: "Origin" };

  if (!origin) return headers;

  const allowed = allowedOrigins().some((pattern) =>
    originMatches(origin, pattern),
  );

  if (!allowed) return headers;

  return {
    ...headers,
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
  };
}

function applyCors(req, res) {
  const headers = corsHeaders(req);
  for (const [name, value] of Object.entries(headers)) {
    res.setHeader?.(name, value);
  }
}

async function readRawBody(req) {
  // Vercel/Netlify may parse the body before the function runs.
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === "string") return req.body;
    if (Buffer.isBuffer(req.body)) return req.body.toString("utf8");
    if (typeof req.body === "object") return JSON.stringify(req.body);
  }

  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(
          new ContactError("Request body is too large.", {
            status: 413,
            code: "body_too_large",
          }),
        );
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", (error) => {
      reject(
        new ContactError("Could not read the request body.", {
          status: 400,
          code: "bad_request",
          detail: error?.message,
        }),
      );
    });
  });
}

function sendJson(res, status, body, extraHeaders = {}) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...extraHeaders,
  });
  res.end(payload);
}

export async function processContactRequest({ body, ip = "unknown" }) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      status: 400,
      body: { ok: false, error: "Invalid request. Please try again." },
    };
  }

  // Honeypot: bots fill this hidden field. Pretend it worked, send nothing.
  if (text(body.botcheck)) {
    return { status: 200, body: { ok: true, message: "Message sent!" } };
  }

  const name = text(body.name);
  const email = text(body.email);
  const message = text(body.message);

  if (!name) {
    return {
      status: 400,
      body: { ok: false, field: "name", error: "Please enter your name." },
    };
  }
  if (name.length > 100) {
    return {
      status: 400,
      body: {
        ok: false,
        field: "name",
        error: "Your name is too long (100 characters max).",
      },
    };
  }
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return {
      status: 400,
      body: {
        ok: false,
        field: "email",
        error: "Please enter a valid email address.",
      },
    };
  }
  if (message.length < 5) {
    return {
      status: 400,
      body: {
        ok: false,
        field: "message",
        error: "Please write a message (at least 5 characters).",
      },
    };
  }
  if (message.length > 5000) {
    return {
      status: 400,
      body: {
        ok: false,
        field: "message",
        error: "Your message is too long (5000 characters max).",
      },
    };
  }

  if (isRateLimited(ip)) {
    return {
      status: 429,
      body: {
        ok: false,
        error:
          "Too many messages sent from this connection. Please try again in a few minutes.",
      },
    };
  }

  try {
    const result = await sendContactEmail({ name, email, message });
    return {
      status: 200,
      body: {
        ok: true,
        message: "Message sent! I'll get back to you soon.",
        messageId: result.messageId,
      },
    };
  } catch (error) {
    const status = error instanceof ContactError ? error.status : 500;
    const detail = error instanceof ContactError ? error.detail : "";

    console.error(
      "[contact] send failed:",
      error?.code || "unknown_error",
      detail || error?.message || String(error),
    );

    return {
      status,
      body: {
        ok: false,
        error:
          status === 503
            ? "The contact form is not configured yet. Please email me directly."
            : "Message could not be sent. Please email me directly.",
        // Helpful while running locally; never exposes internals in production.
        ...(process.env.NODE_ENV !== "production" && detail
          ? { detail }
          : {}),
      },
    };
  }
}

export async function handleContactRequest(req, res) {
  applyCors(req, res);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      Allow: "POST, OPTIONS",
      "Cache-Control": "no-store",
    });
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(
      res,
      405,
      { ok: false, error: "Method not allowed. Use POST." },
      { Allow: "POST, OPTIONS" },
    );
    return;
  }

  const contentType = req.headers["content-type"] || "";
  if (!contentType.includes("application/json")) {
    sendJson(res, 415, {
      ok: false,
      error: "Please submit the form as JSON.",
    });
    return;
  }

  try {
    const raw = await readRawBody(req);
    let body;
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch {
      sendJson(res, 400, {
        ok: false,
        error: "Invalid JSON body. Please try again.",
      });
      return;
    }

    const result = await processContactRequest({
      body,
      ip: clientIp(req),
    });
    sendJson(res, result.status, result.body);
  } catch (error) {
    if (error instanceof ContactError) {
      sendJson(res, error.status, {
        ok: false,
        error: error.message,
      });
      return;
    }

    console.error("[contact] unexpected error:", error);
    sendJson(res, 500, {
      ok: false,
      error: "Something went wrong. Please email me directly.",
    });
  }
}
