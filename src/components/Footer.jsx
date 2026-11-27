import Star from "./Star.jsx";
import { CONTACT, NAV_ITEMS, PROJECTS } from "../data/content.js";

export default function Footer() {
  return (
    <footer className="relative bg-(--color-ink) px-6 pt-16 pb-8 text-(--color-canvas)">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <a
            href="#home"
            className="font-display text-3xl font-extrabold tracking-tight"
          >
            urvashi<span className="text-(--color-accent)">*</span>
          </a>
          <p className="mt-4 max-w-xs font-body text-sm text-(--color-canvas)/70">
            AI &amp; Digital Marketing Learner from Kaithal, Haryana — C, C++ and
            web projects.
          </p>
        </div>

        <div>
          <p className="font-body text-xs tracking-[0.2em] uppercase text-(--color-canvas)/50">
            quick links
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-2 font-body text-sm">
            {NAV_ITEMS.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-(--color-canvas)/80 transition hover:text-(--color-canvas)"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-body text-xs tracking-[0.2em] uppercase text-(--color-canvas)/50">
            find me
          </p>
          <ul className="mt-4 space-y-2 font-body text-sm text-(--color-canvas)/80">
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="hover:text-(--color-canvas)"
              >
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a
                href={CONTACT.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-(--color-canvas)"
              >
                GitHub ↗
              </a>
            </li>
            <li>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-(--color-canvas)"
              >
                LinkedIn ↗
              </a>
            </li>
            {PROJECTS.map((project) => (
              <li key={project.name}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-(--color-canvas)"
                >
                  {project.name} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-(--color-canvas)/15 pt-6 font-body text-xs text-(--color-canvas)/50 sm:flex-row">
        <span>© {new Date().getFullYear()} Urvashi Saini. All rights reserved.</span>
        <a
          href="#home"
          className="flex items-center gap-2 hover:text-(--color-canvas)"
        >
          <Star className="h-3 w-3" /> back to top
        </a>
      </div>
    </footer>
  );
}
