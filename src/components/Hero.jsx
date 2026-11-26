import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Star from "./Star.jsx";
import { HERO_MARQUEE } from "../data/content.js";

gsap.registerPlugin(ScrollTrigger);

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 1, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero() {
  const starRef = useRef(null);
  const [photoOk, setPhotoOk] = useState(true);

  useEffect(() => {
    if (!starRef.current) return;

    const tween = gsap.to(starRef.current, {
      rotate: 360,
      ease: "none",
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-(--color-accent) grain"
    >
      <div className="relative z-10 mt-16 flex items-center gap-6 overflow-hidden border-b border-(--color-canvas)/20 bg-(--color-accent-deep)/40 py-2.5 font-body text-xs tracking-[0.3em] uppercase text-(--color-canvas)/80">
        <div className="flex shrink-0 animate-[marquee_22s_linear_infinite] gap-6 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, groupIndex) => (
            <div className="flex shrink-0 gap-6" key={groupIndex}>
              {HERO_MARQUEE.map((word) => (
                <span className="flex gap-6" key={`${groupIndex}-${word}`}>
                  <span>{word}</span>
                  <Star className="h-3 w-3 self-center" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6.5rem)] max-w-6xl flex-col-reverse gap-10 px-6 pt-12 pb-16 md:flex-row md:items-center md:gap-4">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex-1 md:pl-4"
        >
          <motion.p
            variants={item}
            className="font-body text-sm tracking-[0.2em] uppercase text-(--color-canvas)/80"
          >
            Kaithal, Haryana · MCA student
          </motion.p>
          <motion.h2
            variants={item}
            className="font-display mt-6 text-4xl font-extrabold text-(--color-canvas) sm:text-5xl"
          >
            hi, i&apos;m
          </motion.h2>
          <motion.h1
            variants={item}
            className="font-display -mt-2 text-6xl font-extrabold tracking-tight text-(--color-canvas) sm:text-8xl md:text-8xl lg:text-9xl"
          >
            URVASHI
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 max-w-sm font-body text-(--color-canvas)/80"
          >
            A digital marketing learner blending creativity with AI tools to
            plan campaigns, create content and grow brands online.
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-(--color-accent-deep) px-6 py-3 font-body text-sm font-medium text-(--color-canvas) transition hover:brightness-110"
            >
              See my projects <span aria-hidden="true">↓</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center rounded-full border border-(--color-canvas)/50 px-6 py-3 font-body text-sm text-(--color-canvas) transition hover:bg-(--color-canvas)/10"
            >
              Get in touch
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 1, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex-1"
        >
          <div className="group relative mx-auto aspect-[3/4] w-full max-w-sm md:max-w-md">
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] rounded-t-[8rem] border border-(--color-canvas)/35 bg-(--color-accent-deep)/15 transition-all duration-500 ease-out group-hover:translate-x-4 group-hover:translate-y-4 group-hover:rotate-1"
            />

            <div className="relative h-full w-full overflow-hidden rounded-[2rem] rounded-t-[8rem] border-[3px] border-(--color-canvas) bg-(--color-canvas)/10 shadow-[0_22px_60px_-24px_rgba(31,20,26,0.75)] transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:border-(--color-accent-soft) group-hover:shadow-[0_30px_80px_-28px_rgba(31,20,26,0.85)]">
              {photoOk ? (
                <img
                  src="/img/urvashi.webp"
                  alt="Portrait of Urvashi Saini"
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                  onError={() => setPhotoOk(false)}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-(--color-canvas)/70">
                  <Star className="h-10 w-10" />
                  <span className="font-body text-sm tracking-wide uppercase">
                    your photo here
                  </span>
                </div>
              )}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-t from-(--color-accent-deep)/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </div>
          </div>

          <div
            ref={starRef}
            className="absolute -bottom-6 -left-6 h-24 w-24 text-(--color-canvas) drop-shadow-lg sm:-bottom-8 sm:-left-10 sm:h-32 sm:w-32"
          >
            <Star className="h-full w-full" />
          </div>

          <span className="stamp-rotate absolute -top-4 right-2 rounded-full bg-(--color-canvas) px-4 py-1.5 font-body text-xs font-medium text-(--color-accent-deep) shadow-lg sm:right-6">
            open to entry-level roles
          </span>
        </motion.div>
      </div>
    </section>
  );
}
