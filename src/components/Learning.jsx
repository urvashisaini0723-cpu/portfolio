import { TRAINING } from "../data/content.js";

export default function Learning() {
  return (
    <section id="learning" className="relative bg-(--color-canvas) px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="reveal">
          <span className="stamp-rotate inline-block rounded-full bg-(--color-accent-deep) px-5 py-2 font-body text-sm font-medium text-(--color-canvas)">
            always growing
          </span>
          <h2 className="font-display mt-4 text-5xl font-extrabold tracking-tight text-(--color-ink) sm:text-6xl">
            what i&apos;m learning
          </h2>
          <p className="mt-4 max-w-xl font-body text-lg text-(--color-ink)/75">
            Beyond my degree, I keep adding practical training — from core
            programming to web basics and AI-powered marketing.
          </p>
        </div>

        <div className="reveal mt-12 grid gap-6 md:grid-cols-3">
          {TRAINING.map((course, index) => (
            <article
              key={course.title}
              className={`rounded-sm border border-(--color-ink)/10 bg-(--color-accent-soft)/60 p-6 shadow-lg ${
                index === 1 ? "md:-rotate-1" : "md:rotate-1"
              }`}
            >
              <h3 className="font-display text-2xl font-extrabold text-(--color-ink)">
                {course.title}
              </h3>
              <p className="mt-1 font-body text-sm text-(--color-accent-deep)">
                {course.org}
              </p>
              <ul className="mt-4 space-y-2 font-body text-sm text-(--color-ink)/80">
                {course.points.map((point) => (
                  <li key={point}>— {point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
