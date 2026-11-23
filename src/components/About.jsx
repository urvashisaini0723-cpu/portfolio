import { ABOUT_TAGS, EDUCATION } from "../data/content.js";

export default function About() {
  return (
    <section id="about" className="relative bg-(--color-canvas) px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-start">
        <div className="reveal">
          <span className="stamp-rotate inline-block rounded-full bg-(--color-accent-soft) px-5 py-2 font-body text-sm font-medium text-(--color-accent-deep)">
            hello!
          </span>
          <h2 className="font-display mt-6 text-6xl font-extrabold tracking-tight text-(--color-ink) sm:text-7xl">
            about <span className="text-(--color-accent)">me</span>
          </h2>
          <p className="mt-8 max-w-md font-body text-lg leading-relaxed text-(--color-ink)/80">
            I&apos;m Urvashi Saini — a motivated and enthusiastic BCA graduate
            looking for an entry-level position in software development. I&apos;m
            skilled in C and C++, with hands-on project and training experience.
          </p>
          <p className="mt-4 max-w-md font-body text-lg leading-relaxed text-(--color-ink)/80">
            I&apos;m passionate about learning new technologies and contributing
            to real-world software solutions. Right now I&apos;m pursuing my MCA
            from Kurukshetra University.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {ABOUT_TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-(--color-ink)/15 bg-white px-4 py-2 font-body text-sm text-(--color-ink)/70 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="reveal space-y-6">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-(--color-ink)/50">
            education
          </p>
          {EDUCATION.map((edu, index) => (
            <div
              key={edu.degree}
              className={`rounded-sm bg-white p-6 shadow-xl ${
                index ? "-rotate-1" : "rotate-1"
              }`}
            >
              <span className="font-body text-xs uppercase tracking-wide text-(--color-accent-deep)">
                {edu.period}
              </span>
              <h3 className="font-display mt-1 text-xl font-extrabold text-(--color-ink)">
                {edu.degree}
              </h3>
              <p className="mt-1 font-body text-(--color-ink)/70">
                {edu.institute}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
