import { useState } from "react";
import { PROJECTS } from "../data/content.js";

const INITIAL_PROJECT_COUNT = 2;

export default function Projects() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded
    ? PROJECTS
    : PROJECTS.slice(0, INITIAL_PROJECT_COUNT);

  return (
    <section id="projects" className="relative bg-(--color-ink) px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="reveal">
          <span className="stamp-rotate inline-block rounded-full border border-(--color-canvas)/40 px-5 py-2 font-body text-sm text-(--color-canvas)">
            things i&apos;ve built
          </span>
          <h2 className="font-display mt-4 text-6xl font-extrabold tracking-tight text-(--color-canvas) sm:text-7xl">
            PROJECTS
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {visible.map((project, index) => (
            <article
              key={project.name}
              className={`rounded-sm bg-(--color-canvas) p-8 shadow-2xl ${
                index % 2 ? "-rotate-1" : "rotate-1"
              }`}
            >
              <span className="rounded-full bg-(--color-accent-soft) px-4 py-1 font-body text-xs uppercase tracking-wide text-(--color-accent-deep)">
                {project.type}
              </span>
              <h3 className="font-display mt-4 text-4xl font-extrabold text-(--color-ink)">
                {project.name}
              </h3>
              <p className="mt-3 font-body text-(--color-ink)/75">
                {project.desc}
              </p>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-(--color-accent-deep) px-5 py-2.5 font-body text-sm text-(--color-canvas) transition hover:brightness-125"
              >
                {project.label} <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>

        {PROJECTS.length > INITIAL_PROJECT_COUNT && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="rounded-full border border-(--color-canvas)/50 px-6 py-3 font-body text-sm text-(--color-canvas) transition hover:bg-(--color-canvas)/10"
            >
              {expanded ? "See less" : "See more"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
