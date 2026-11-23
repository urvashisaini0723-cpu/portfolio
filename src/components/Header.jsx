import { useEffect, useState } from "react";
import { NAV_ITEMS } from "../data/content.js";

export default function Header() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      let current = "home";
      for (const [id] of NAV_ITEMS) {
        const section = document.getElementById(id);
        if (
          section &&
          section.getBoundingClientRect().top <= window.innerHeight * 0.4
        ) {
          current = id;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-(--color-canvas)/20 bg-(--color-accent-deep)/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#home"
          className="font-display text-xl font-extrabold tracking-tight text-(--color-canvas)"
        >
          urvashi<span className="text-(--color-accent-soft)">*</span>
        </a>

        <ul className="hidden gap-1 md:flex">
          {NAV_ITEMS.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`rounded-full px-4 py-2 font-body text-sm transition ${
                  active === id
                    ? "bg-(--color-canvas) text-(--color-accent-deep)"
                    : "text-(--color-canvas)/80 hover:text-(--color-canvas)"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-full border border-(--color-canvas)/40 px-4 py-1.5 font-body text-sm text-(--color-canvas) md:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {menuOpen && (
        <ul className="border-t border-(--color-canvas)/20 px-6 py-3 md:hidden">
          {NAV_ITEMS.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setMenuOpen(false)}
                className={`block py-2 font-body ${
                  active === id
                    ? "text-(--color-canvas)"
                    : "text-(--color-canvas)/70"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
