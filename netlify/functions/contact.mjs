import { processContactRequest } from "../../server/contactHandler.js";

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed. Use POST." });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return json(415, {
      ok: false,
      error: "Please submit the form as JSON.",
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, {
      ok: false,
      error: "Invalid JSON body. Please try again.",
    });
  }

  const ip =
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for") ||
    "unknown";

  const result = await processContactRequest({ body, ip });
  return json(result.status, result.body);
}
