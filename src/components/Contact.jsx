import { useState } from "react";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
} from "./ContactIcons.jsx";
import { CONTACT, CONTACT_LINKS } from "../data/content.js";

const ICONS = {
  mail: MailIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  location: MapPinIcon,
};

// Empty in local dev / single-host deployments so requests stay same-origin.
// Set VITE_API_BASE_URL on Vercel when the API is hosted separately on Render.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/+$/,
  "",
);

const fieldClass =
  "w-full rounded-sm border border-(--color-ink)/15 bg-white px-4 py-3 font-body text-sm text-(--color-ink) placeholder:text-(--color-ink)/40 focus:border-(--color-accent) focus:outline-none";

const labelClass =
  "mb-1.5 block font-body text-xs font-medium uppercase tracking-wide text-(--color-ink)/60";

export default function Contact() {
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: String(data.get("name") || "").trim(),
          email: String(data.get("email") || "").trim(),
          message: String(data.get("message") || "").trim(),
          botcheck: data.get("botcheck") ? "filled" : "",
        }),
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.ok) {
        setStatus("success");
        setFeedback(
          result.message || "Message sent! I'll get back to you soon.",
        );
        form.reset();
        return;
      }

      setStatus("error");
      const message =
        result?.error || "Message could not be sent. Please email me directly.";
      setFeedback(
        import.meta.env.DEV && result?.detail
          ? `${message} (${result.detail})`
          : message,
      );
    } catch {
      setStatus("error");
      setFeedback("Message could not be sent. Please email me directly.");
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-(--color-accent-deep) px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="stamp-rotate inline-block rounded-full border border-(--color-canvas)/40 px-5 py-2 font-body text-sm text-(--color-canvas)">
            get in touch
          </span>
          <h2 className="font-display mt-4 text-5xl font-extrabold tracking-tight text-(--color-canvas) sm:text-6xl">
            let&apos;s get in{" "}
            <span className="text-(--color-accent-soft)">contact</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-body text-(--color-canvas)/75">
            Open to entry-level software development roles, collaborations and
            feedback on my work.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="reveal rounded-sm bg-(--color-canvas) p-8 shadow-2xl sm:p-10">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-(--color-ink)/50">
              contact details
            </p>
            <h3 className="font-display mt-3 text-2xl font-extrabold text-(--color-ink) sm:text-3xl">
              I&apos;m open to opportunities.
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-(--color-ink)/70">
              Whether it&apos;s an entry-level role, a collaboration, or feedback
              on my work — I&apos;d love to hear from you.
            </p>

            <ul className="mt-7 border-t border-(--color-ink)/10">
              {CONTACT_LINKS.map((link) => {
                const Icon = ICONS[link.icon];
                const row = (
                  <>
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--color-accent-soft) text-(--color-accent-deep) transition ${
                        link.href
                          ? "group-hover:bg-(--color-accent) group-hover:text-(--color-canvas)"
                          : ""
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-body text-xs uppercase tracking-wide text-(--color-ink)/50">
                        {link.label}
                      </span>
                      <span className="mt-0.5 block break-words font-body text-sm text-(--color-ink)/80 transition group-hover:text-(--color-ink)">
                        {link.value}
                      </span>
                    </span>
                  </>
                );

                return (
                  <li
                    key={link.label}
                    className="border-b border-(--color-ink)/10 last:border-b-0"
                  >
                    {link.href ? (
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noreferrer" : undefined}
                        className="group flex items-center gap-4 py-4"
                      >
                        {row}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 py-4">{row}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="reveal rounded-sm bg-(--color-canvas) p-8 shadow-2xl sm:p-10">
            <h3 className="font-display text-2xl font-extrabold text-(--color-ink) sm:text-3xl">
              Send me a message
            </h3>
            <p className="mt-2 font-body text-sm text-(--color-ink)/60">
              Fill in your details below and I&apos;ll get back to you.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                name="botcheck"
                className="hidden"
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div>
                <label htmlFor="contact-name" className={labelClass}>
                  Your name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  required
                  maxLength={100}
                  placeholder="Your name"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="contact-email" className={labelClass}>
                  Your email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  placeholder="you@example.com"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className={labelClass}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  minLength={5}
                  maxLength={5000}
                  rows={4}
                  placeholder="Tell me about the role, project or idea…"
                  className={fieldClass}
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-full bg-(--color-accent-deep) px-6 py-3 font-body text-sm font-medium text-(--color-canvas) transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send Message"}
              </button>

              {feedback && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`font-body text-sm ${
                    status === "success" ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {feedback}
                  {status === "error" && (
                    <>
                      {" "}
                      <a
                        href={`mailto:${CONTACT.email}`}
                        className="underline underline-offset-2"
                      >
                        {CONTACT.email}
                      </a>
                    </>
                  )}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
