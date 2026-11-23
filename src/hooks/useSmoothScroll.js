import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HEADER_OFFSET = -64;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

let lenisInstance = null;

export function getLenis() {
  return lenisInstance;
}

/**
 * Scroll to a section by id. Uses the shared Lenis instance when available so
 * the fixed-header offset stays consistent with the rest of the site. Defaults
 * to a smooth animated scroll; pass `immediate: true` to jump instantly.
 */
export function scrollToSection(
  id,
  { offset = HEADER_OFFSET, immediate = false } = {},
) {
  if (typeof document === "undefined") return false;

  const target = document.getElementById(id);
  if (!target) return false;

  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset,
      immediate,
      force: true,
    });
    return true;
  }

  const top = target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: immediate ? "auto" : "smooth",
  });
  return true;
}

/**
 * Smooth scrolling with Lenis, driven by GSAP's ticker so ScrollTrigger stays
 * perfectly in sync. Also owns in-page anchor navigation: clicking any
 * `href="#section"` link smooth-scrolls to that section (no visual effects),
 * a refresh always lands on the home section, and back/forward stays in sync.
 */
export default function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
    });

    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Smooth-scroll to in-page sections when an anchor is clicked.
    const onClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link =
        event.target instanceof Element
          ? event.target.closest('a[href^="#"]')
          : null;

      if (!link || link.target === "_blank" || link.hasAttribute("download")) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      let id;
      try {
        id = decodeURIComponent(href.slice(1));
      } catch {
        return;
      }

      if (!document.getElementById(id)) return;

      event.preventDefault();
      window.history.pushState(null, "", href);
      scrollToSection(id, {
        offset: HEADER_OFFSET,
        immediate: window.matchMedia(REDUCED_MOTION).matches,
      });
    };
    document.addEventListener("click", onClick);

    // Refresh always returns to the home section; back/forward stays in sync.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const navEntry = performance.getEntriesByType?.("navigation")?.[0];
    const isReload = navEntry?.type === "reload";
    const hash = window.location.hash.slice(1);

    if (isReload) {
      // A refresh must always start from the top, even if the URL carried a
      // hash. Drop the hash so the browser does not jump to a section.
      if (window.location.hash) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
      }
      window.scrollTo(0, 0);
    } else if (hash && document.getElementById(hash)) {
      // A fresh open of a deep link (e.g. /#projects) jumps to that section.
      scrollToSection(hash, { offset: HEADER_OFFSET, immediate: true });
    }

    const onHashChange = () => {
      const id = window.location.hash.slice(1);
      if (!id || !document.getElementById(id)) return;
      scrollToSection(id, {
        offset: HEADER_OFFSET,
        immediate: window.matchMedia(REDUCED_MOTION).matches,
      });
    };
    window.addEventListener("hashchange", onHashChange);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
      gsap.ticker.remove(raf);
      lenis.destroy();
      if (lenisInstance === lenis) lenisInstance = null;
    };
  }, []);
}