import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Fades + lifts every `.reveal` element into place the first time it enters
 * the viewport. Elements start hidden and are animated once (once: true).
 */
export default function useReveal(selector = ".reveal") {
  useEffect(() => {
    const elements = gsap.utils.toArray(selector);

    const tweens = elements.map((el) =>
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        },
      ),
    );

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, [selector]);
}
