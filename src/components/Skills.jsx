import Star from "./Star.jsx";
import { SKILL_GROUPS, SOFT_SKILLS, STATS } from "../data/content.js";

const SKILL_ICONS = {
  C: "/icons/c.svg",
  "C++": "/icons/cplusplus.svg",
  HTML: "/icons/html5.svg",
  CSS: "/icons/css3.svg",
  JavaScript: "/icons/javascript.svg",
  Python: "/icons/python.svg",
  OOP: "/icons/oop.svg",
  "Data Structures": "/icons/data-structures.svg",
  Git: "/icons/git.svg",
  "VS Code": "/icons/vscode.svg",
  ChatGPT: "/icons/openai.svg",
  Claude: "/icons/claude.svg",
  OpenCode: "/icons/opencode.svg",
  Replit: "/icons/replit.svg",
  Vercel: "/icons/vercel.svg",
  "Node.js": "/icons/nodedotjs.svg",
  React: "/icons/react.svg",
  Windows: "/icons/windows.svg",
  Linux: "/icons/linux.svg",
};

function tileGridClass(count) {
  if (count > 6) {
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9";
  }
  if (count > 2) {
    return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6";
  }
  return "grid-cols-2";
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative bg-(--color-accent) px-6 py-24 grain"
    >
      <div className="mx-auto max-w-6xl">
        <div className="reveal">
          <span className="stamp-rotate inline-block rounded-full bg-(--color-canvas) px-5 py-2 font-body text-sm font-medium text-(--color-accent-deep)">
            what i bring
          </span>
          <h2 className="font-display mt-4 text-5xl font-extrabold tracking-tight text-(--color-canvas) sm:text-6xl">
            skills
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {SKILL_GROUPS.map(({ name, note, skills }) => {
            const wide = skills.length > 2;
            const compact = skills.length <= 2;

            return (
              <div
                key={name}
                className={`reveal flex flex-col rounded-sm border border-(--color-canvas)/25 bg-(--color-canvas)/10 p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-(--color-canvas)/15 sm:p-8 ${
                  wide ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                  <div>
                    <p className="font-display text-2xl italic text-(--color-canvas) sm:text-3xl">
                      {name}
                    </p>
                    <p className="mt-1.5 font-body text-xs uppercase tracking-[0.18em] text-(--color-canvas)/60">
                      {note}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-(--color-canvas)/35 px-3 py-1 font-body text-[11px] uppercase tracking-[0.16em] text-(--color-canvas)/65">
                    {String(skills.length).padStart(2, "0")} skills
                  </span>
                </div>

                <ul
                  className={`mt-7 grid auto-rows-fr gap-3 ${tileGridClass(
                    skills.length,
                  )}`}
                >
                  {skills.map((skill) => (
                    <li
                      key={skill}
                      className={`group/skill flex h-full flex-col items-center justify-center gap-3 rounded-sm border border-(--color-accent-deep)/5 bg-(--color-canvas) text-center shadow-[0_12px_28px_-22px_rgba(31,20,26,0.55)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(31,20,26,0.7)] ${
                        compact ? "px-4 py-9 sm:py-11" : "px-3 py-5 sm:py-6"
                      }`}
                    >
                      {SKILL_ICONS[skill] && (
                        <img
                          src={SKILL_ICONS[skill]}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          draggable={false}
                          className={`shrink-0 object-contain transition-transform duration-300 ease-out group-hover/skill:scale-110 ${
                            compact
                              ? "h-14 w-14 sm:h-16 sm:w-16"
                              : "h-11 w-11 sm:h-12 sm:w-12"
                          }`}
                        />
                      )}
                      <span
                        className={`font-body font-medium leading-tight text-(--color-accent-deep) ${
                          compact ? "text-base" : "text-sm"
                        }`}
                      >
                        {skill}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="reveal mt-10 flex flex-wrap gap-3">
          {SOFT_SKILLS.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-2 rounded-full border border-(--color-canvas)/40 px-4 py-1.5 font-body text-xs uppercase tracking-wide text-(--color-canvas)"
            >
              <Star className="h-3 w-3" />
              {skill}
            </span>
          ))}
        </div>

        <div className="reveal mt-16 grid gap-6 sm:grid-cols-3">
          {STATS.map(([value, label], index) => (
            <div
              key={label}
              className={`rounded-sm bg-(--color-canvas) p-6 shadow-2xl ${
                index === 1 ? "-rotate-1" : "rotate-1"
              }`}
            >
              <div className="font-display text-7xl font-extrabold text-(--color-accent-deep)">
                {value}
              </div>
              <p className="mt-2 font-body text-(--color-ink)/75">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
