const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const DEFAULT_TO_EMAIL = "urvashisaini0723@gmail.com";
const DEFAULT_FROM_NAME = "Urvashi Saini Portfolio";

export class ContactError extends Error {
  constructor(message, { status = 500, code = "send_failed", detail = "" } = {}) {
    super(message);
    this.name = "ContactError";
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

function envValue(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function getContactConfig() {
  const toEmail = envValue(process.env.CONTACT_TO_EMAIL, DEFAULT_TO_EMAIL);
  return {
    apiKey: envValue(process.env.BREVO_API_KEY, ""),
    toEmail,
    fromEmail: envValue(process.env.CONTACT_FROM_EMAIL, toEmail),
    fromName: envValue(process.env.CONTACT_FROM_NAME, DEFAULT_FROM_NAME)
      .replace(/[\r\n]+/g, " ")
      .slice(0, 70),
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function messageHtml(message) {
  return escapeHtml(message).replace(/\r?\n/g, "<br />");
}

function renderEmail({ name, email, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = messageHtml(message);

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f7f4f1;font-family:Arial,Helvetica,sans-serif;color:#1f1a1c;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4f1;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 12px 32px rgba(31,26,28,0.08);">
            <tr>
              <td style="background:#4a2438;padding:28px 32px;color:#f7f4f1;">
                <p style="margin:0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;opacity:0.7;">Portfolio contact form</p>
                <h1 style="margin:8px 0 0;font-size:24px;line-height:1.25;">New message from ${safeName}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px;">
                <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#7a6f74;">Name</p>
                <p style="margin:0 0 18px;font-size:16px;">${safeName}</p>

                <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#7a6f74;">Email</p>
                <p style="margin:0 0 18px;font-size:16px;"><a href="mailto:${safeEmail}" style="color:#8a4b63;">${safeEmail}</a></p>

                <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#7a6f74;">Message</p>
                <p style="margin:0;font-size:16px;line-height:1.6;">${safeMessage}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;background:#faf8f6;border-top:1px solid #eee7e2;font-size:12px;color:#7a6f74;">
                Sent from urvashi-portfolio · reply directly to this email to answer ${safeName}.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderText({ name, email, message }) {
  return [
    "New message from your portfolio contact form",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
    "",
    "Reply directly to this email to answer.",
  ].join("\n");
}

export async function sendContactEmail({ name, email, message }) {
  const config = getContactConfig();
  const displayName = name.replace(/[\r\n\t]+/g, " ").trim();

  if (!config.apiKey) {
    throw new ContactError("BREVO_API_KEY is not configured.", {
      status: 503,
      code: "not_configured",
      detail:
        "Add BREVO_API_KEY to .env (server-side, without the VITE_ prefix).",
    });
  }

  const payload = {
    sender: { name: config.fromName, email: config.fromEmail },
    to: [{ email: config.toEmail, name: "Urvashi Saini" }],
    replyTo: { email, name: displayName },
    subject: `Portfolio message from ${displayName}`.slice(0, 200),
    htmlContent: renderEmail({ name: displayName, email, message }),
    textContent: renderText({ name: displayName, email, message }),
    tags: ["portfolio-contact"],
  };

  let response;
  try {
    response = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": config.apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    throw new ContactError("Could not reach the email service.", {
      status: 502,
      code: "network_error",
      detail: error?.message || String(error),
    });
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ContactError("The email service rejected the message.", {
      status: 502,
      code: "brevo_error",
      detail: `Brevo ${response.status}: ${
        result?.message || result?.code || response.statusText
      }`,
    });
  }

  return { messageId: result?.messageId || null };
}
