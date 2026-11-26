export const NAV_ITEMS = [
  ["home", "Home"],
  ["about", "About"],
  ["skills", "Skills"],
  ["learning", "Learning"],
  ["projects", "Projects"],
  ["contact", "Contact"],
];

export const HERO_MARQUEE = [
  "c & c++",
  "oop",
  "data structures",
  "web development",
  "problem solving",
];

export const ABOUT_TAGS = [
  "Kaithal, Haryana",
  "BCA graduate · 2025",
  "MCA · 2025 – present",
  "Quick learner",
];

export const EDUCATION = [
  {
    period: "2025 – Present",
    degree: "Master of Computer Application (MCA)",
    institute: "Kurukshetra University (KUK), Online Mode",
  },
  {
    period: "2022 – 2025",
    degree: "Bachelor of Computer Application (BCA)",
    institute: "CH. Ishwar Singh Kanya Mahavidalya, Pundri, Kaithal",
  },
];

export const SKILL_GROUPS = [
  {
    name: "Programming Languages",
    note: "Languages I build with",
    skills: ["C", "C++", "HTML", "CSS", "JavaScript", "Python"],
  },
  {
    name: "Tools & Technologies",
    note: "My everyday workflow",
    skills: [
      "Git",
      "VS Code",
      "ChatGPT",
      "Claude",
      "OpenCode",
      "Replit",
      "Vercel",
      "Node.js",
      "React",
    ],
  },
  {
    name: "Concepts",
    note: "Core CS foundations",
    skills: ["OOP", "Data Structures"],
  },
  {
    name: "Operating Systems",
    note: "Where I work",
    skills: ["Windows", "Linux"],
  },
];

export const SOFT_SKILLS = [
  "Strong problem-solving",
  "Quick learner",
  "Communication & teamwork",
  "Attention to detail",
  "Hardworking & reliable",
];

export const STATS = [
  ["2", "projects built & deployed online"],
  ["3", "professional training programs completed"],
  ["2", "degrees: BCA done, MCA in progress"],
];

export const TRAINING = [
  {
    title: "C & C++ Training Program",
    org: "HARTRON Skill Centre, Panchkula",
    points: [
      "Fundamentals and advanced concepts in C and C++",
      "Small projects: file handling, OOP and data structures",
      "Practised problem-solving and logical building",
    ],
  },
  {
    title: "NIELIT Government Course",
    org: "ZED-KING Institute, Kaithal",
    points: [
      "Basic knowledge of computers",
      "Basics of HTML, CSS, JavaScript",
      "Python and IoT",
    ],
  },
  {
    title: "Digital Marketing with AI",
    org: "ZED-KING Institute, Kaithal",
    points: [
      "Using AI tools to plan and optimise campaigns",
      "Content creation and audience targeting with AI",
      "SEO and social media marketing fundamentals",
    ],
  },
];

export const PROJECTS = [
  {
    name: "Burger Rush",
    type: "Web-Based Game",
    image: "/img/burger-rush.svg",
    url: "https://burger-rush-1.ai.studio",
    label: "burger-rush-1.ai.studio",
    desc: "An interactive browser-based game featuring engaging gameplay and a responsive user interface.",
  },
  {
    name: "Fly High Consultancy",
    type: "Website",
    image: "/img/fly-high-consultancy.svg",
    url: "https://fly-high-consultancy.vercel.app",
    label: "fly-high-consultancy.vercel.app",
    desc: "A responsive consultancy website, designed, developed and deployed online on Vercel.",
  },
];

export const CONTACT = {
  email: "urvashisaini0723@gmail.com",
  location: "Kaithal, Haryana",
  github: "https://github.com/urvashisaini0723-cpu",
  githubLabel: "github.com/urvashisaini0723-cpu",
  linkedin: "https://www.linkedin.com/in/urvashi-saini-241798375/",
  linkedinLabel: "linkedin.com/in/urvashi-saini-241798375",
};

export const CONTACT_LINKS = [
  {
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    icon: "mail",
  },
  {
    label: "GitHub",
    value: CONTACT.githubLabel,
    href: CONTACT.github,
    icon: "github",
    external: true,
  },
  {
    label: "LinkedIn",
    value: CONTACT.linkedinLabel,
    href: CONTACT.linkedin,
    icon: "linkedin",
    external: true,
  },
  {
    label: "Location",
    value: CONTACT.location,
    href: null,
    icon: "location",
  },
];

export const THEME = {
  canvas: "oklch(97% 0.005 68)",
  ink: "oklch(20% 0.015 347)",
  accent: "oklch(60% 0.077 356)",
  accentDeep: "oklch(30% 0.07 359)",
  accentSoft: "oklch(92% 0.02 356)",
};

