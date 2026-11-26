# Portfolio Project — AGENTS.md

## Overview
Personal portfolio website for Urvashi Saini — aspiring software developer. Built with React 19, Vite 6, Tailwind CSS v4, Framer Motion, GSAP ScrollTrigger, Lenis smooth scroll, and Brevo transactional email via a Node.js API.

## Tech Stack
- **Framework:** React 19
- **Build tool:** Vite 6
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animation:** Framer Motion + GSAP ScrollTrigger
- **Scrolling:** Lenis smooth scroll
- **Email:** Brevo transactional email + Node.js API
- **Fonts:** Cabinet Grotesk + Satoshi (Bunny Fonts)

## Project Structure
```
portfolio/
├── index.html              # SEO / Open Graph meta, fonts
├── api/
│   └── contact.js          # Vercel serverless wrapper for /api/contact
├── netlify/
│   ├── functions/
│   │   └── contact.mjs     # Netlify function wrapper
│   └── toml                # Netlify config
├── server/
│   ├── index.js            # Production static server + /api/contact + /api/health
│   ├── contactApi.js       # Brevo email client
│   └── contactHandler.js   # Validation, rate limit, CORS, JSON responses
├── scripts/
│   └── test-email.mjs      # Standalone Brevo test
├── public/
│   ├── favicon.svg
│   ├── manifest.webmanifest
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── og-image.jpg
│   ├── icons/              # skill logos (C, C++, Git, VS Code, ...)
│   └── img/
│       ├── urvashi.jpg         # hero portrait
│       ├── burger-rush.svg     # Burger Rush project thumbnail
│       └── fly-high-consultancy.svg # Fly High Consultancy thumbnail
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx               # Main app (Header, Hero, About, Skills, Learning, Projects, Contact, Footer)
│   ├── index.css             # Tailwind theme + grain/stamp/marquee CSS
│   ├── data/content.js       # All page copy and links (NAV_ITEMS, PROJECTS, CONTACT, etc.)
│   ├── hooks/
│   │   ├── useSmoothScroll.js  # Lenis + GSAP ticker + anchor navigation
│   │   └── useReveal.js        # Scroll-in reveal for .reveal elements
│   └── components/
│       ├── Header.jsx          # Fixed nav, active link, mobile menu
│       ├── Hero.jsx            # Marquee, intro, portrait, rotating star
│       ├── About.jsx           # Intro copy + education cards
│       ├── Skills.jsx          # Skill groups, soft skills, stats
│       ├── Learning.jsx        # Training programmes
│       ├── Projects.jsx        # Project cards (+ See more logic)
│       ├── Contact.jsx         # Contact cards + Brevo form
│       ├── ContactIcons.jsx    # Mail / GitHub / LinkedIn / pin icons
│       ├── Footer.jsx
│       ├── SectionTransition.jsx
│       └── Star.jsx            # Shared star glyph
├── .env                      # Server-side env (BREVO_API_KEY, etc.) — NOT in repo
├── .env.example              # Template for .env
├── vite.config.js            # Vite config + dev contact API middleware
├── vercel.json               # Vercel build settings (frontend)
├── render.yaml               # Render deployment config (API)
└── README.md                 # Full documentation
```

## Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (http://localhost:5173) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build (includes API) |
| `npm start` | Serve `dist/` + `/api/contact` (Node server) |
| `npm run test:email` | Send Brevo test email |

## Environment Variables

Server-side (Render) — never prefix with `VITE_`:
```
BREVO_API_KEY=your_brevo_api_key_here
CONTACT_TO_EMAIL=urvashisaini0723@gmail.com
CONTACT_FROM_EMAIL=urvashisaini0723@gmail.com
CONTACT_FROM_NAME=Urvashi Saini Portfolio
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173,https://urvashi-portfolio-tawny.vercel.app,https://urvashi-portfolio-*.vercel.app
```

Frontend (Vercel, safe to expose):
```
VITE_API_BASE_URL=https://urvashi-portfolio-api.onrender.com
```

## Content
All text and links live in `src/data/content.js`:
- `NAV_ITEMS` — navigation labels/anchors
- `HERO_MARQUEE`, `ABOUT_TAGS`, `EDUCATION`
- `SKILL_GROUPS`, `SOFT_SKILLS`, `STATS`, `TRAINING`
- `PROJECTS` — add an entry and it appears automatically
- `CONTACT` — email, location, GitHub, LinkedIn
- `CONTACT_LINKS` — contact card links

## Contact Form
On Vercel, posts to `VITE_API_BASE_URL/api/contact` (Render); local dev uses the Vite middleware at `/api/contact`. The server validates → sends via Brevo → Reply-To set to visitor's email.
- Honeypot (`botcheck`) blocks bots
- Rate limit: 5 messages per 10 minutes per IP
- Validation: name (1-100 chars), email (valid format), message (5-5000 chars)

## Deployment (current)
- **Frontend:** Vercel — https://urvashi-portfolio-tawny.vercel.app
- **API:** Render — https://urvashi-portfolio-api.onrender.com
- Vercel build uses `VITE_API_BASE_URL`; Render CORS uses `ALLOWED_ORIGINS`.
- `vercel --prod` deploys the frontend; Render auto-deploys the API from `main`.
- Fallbacks: `api/contact.js` (Vercel serverless), `netlify/functions/contact.mjs`, or a single Node host.

## Key Files to Edit
- Content/copy → `src/data/content.js`
- Theme/colors → `src/index.css` (@theme tokens)
- Contact form logic → `server/contactHandler.js`, `server/contactApi.js`
- Dev API middleware → `vite.config.js` (`contactApiPlugin`)
- Smooth scroll → `src/hooks/useSmoothScroll.js`
- Scroll reveal → `src/hooks/useReveal.js`

## Notes
- Brevo API key stays server-side only (never exposed to browser)
- Render free web services sleep after 15 min idle — the contact section warms the API on page load
- Build output goes to `dist/` — do not commit
- `.env` is not committed — copy from `.env.example`
