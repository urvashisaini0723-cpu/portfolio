# Urvashi Saini — Portfolio

Personal portfolio of **Urvashi Saini**, an aspiring software developer from
Kaithal, Haryana. Built as a single-page React site with a warm, editorial
"scrapbook" look.

## Live site

https://urvashi-portfolio.app.orvisai.com

## Tech stack

| Layer      | Tool                                   |
| ---------- | -------------------------------------- |
| UI         | React 19                               |
| Build      | Vite 6                                 |
| Styling    | Tailwind CSS v4 (`@tailwindcss/vite`)  |
| Animation  | Framer Motion + GSAP ScrollTrigger     |
| Scrolling  | Lenis smooth scroll                    |
| Email      | Brevo transactional email + Node API   |
| Fonts      | Cabinet Grotesk + Satoshi (Bunny Fonts)|

## Getting started

```bash
npm install
cp .env.example .env   # add your Brevo API key and sender email
npm run dev            # http://localhost:5173
npm run build          # production build in dist/
npm run preview        # preview the production build (API included)
npm start              # serve dist/ + /api/contact with the Node server
npm run test:email     # send a Brevo test email
```

## Contact form (Brevo)

The contact form posts to `/api/contact`, a small server-side endpoint that
sends the message through [Brevo](https://www.brevo.com) transactional email.
The Brevo API key stays on the server and is **never** included in the browser
bundle (do not prefix it with `VITE_`).

1. In Brevo, open **Settings → Senders, Domains & Dedicated IPs** and verify
   the sender address (`urvashisaini0723@gmail.com`).
2. Open **Settings → SMTP & API → API Keys & MCP**, create/edit a key and give
   it **Transactional email** permission (or **Full access**). A restricted key
   without this permission fails with `permission_denied`.
3. Add the values to `.env`:

   ```bash
   BREVO_API_KEY=your_brevo_api_key_here
   CONTACT_TO_EMAIL=urvashisaini0723@gmail.com
   CONTACT_FROM_EMAIL=urvashisaini0723@gmail.com
   CONTACT_FROM_NAME=Urvashi Saini Portfolio
   ```

4. Restart `npm run dev` and submit the form, or run `npm run test:email` to
   check Brevo independently of the UI.

Every submission is sent to `CONTACT_TO_EMAIL` with the visitor's address as
**Reply-To**, so replying from Gmail goes straight back to them. The endpoint
validates name/email/message, uses a honeypot, and limits each IP to 5 messages
per 10 minutes.

## Project structure

```text
portfolio/
├── index.html                  # SEO / Open Graph meta, fonts
├── api/
│   └── contact.js              # Vercel serverless wrapper for /api/contact
├── netlify/
│   └── functions/contact.mjs   # Netlify function wrapper
├── server/
│   ├── index.js                # production static server + API
│   ├── contactHandler.js       # validation, rate limit, JSON responses
│   └── contactApi.js           # Brevo transactional email client
├── scripts/
│   └── test-email.mjs          # standalone Brevo test
├── public/
│   ├── favicon.svg
│   ├── manifest.webmanifest
│   ├── robots.txt
│   ├── og-image.jpg
│   ├── icons/                  # skill logos (C, C++, Git, VS Code, ...)
│   └── img/urvashi.jpg         # hero portrait
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css               # Tailwind theme + grain/stamp/marquee CSS
│   ├── data/content.js         # all page copy and links in one place
│   ├── hooks/
│   │   ├── useSmoothScroll.js  # Lenis + GSAP ticker
│   │   └── useReveal.js        # scroll-in reveal for .reveal elements
│   └── components/
│       ├── Header.jsx          # fixed nav, active link, mobile menu
│       ├── Hero.jsx            # marquee, intro, portrait, rotating star
│       ├── About.jsx           # intro copy + education cards
│       ├── Skills.jsx          # skill groups, soft skills, stats
│       ├── Learning.jsx        # training programmes
│       ├── Projects.jsx        # project cards (+ See more logic)
│       ├── Contact.jsx         # contact cards + form
│       ├── ContactIcons.jsx    # mail / GitHub / LinkedIn / pin icons
│       ├── Footer.jsx
│       ├── SectionTransition.jsx # nav curtain transition
│       └── Star.jsx            # shared star glyph
└── ...
```

## Design notes

- **Palette** — warm canvas `#f7f4f1`, near-black ink, dusty rose accent and
  deep plum for the header/contact sections. All colours are defined once in
  `src/index.css` as `@theme` tokens.
- **Type** — Cabinet Grotesk (700/800) for oversized headings, Satoshi
  (400/500/700) for body copy.
- **Texture** — the rose sections use a subtle SVG fractal-noise overlay
  (`.grain`) and cards are slightly rotated to feel hand-placed.
- **Motion** — hero text staggers in with Framer Motion, sections lift in with
  GSAP ScrollTrigger, the star rotates as you scroll through the hero, and the
  page uses Lenis for smooth scrolling.
- **Responsive** — hero stacks (portrait first) below `md`, nav collapses to a
  menu button, grids reflow from 2–3 columns to 1.
- **Skill icons** — brand marks live in `public/icons/` (C/C++/Git/Linux from
  Simple Icons, VS Code from Wikimedia Commons). OOP and Data Structures use
  custom line icons, and the Windows mark is a simple four-pane drawing. Swap
  any file for your own artwork while keeping the same filename.

## Editing content

Most text and links live in `src/data/content.js`:

- `NAV_ITEMS` — navigation labels/anchors
- `HERO_MARQUEE`, `ABOUT_TAGS`, `EDUCATION`
- `SKILL_GROUPS`, `SOFT_SKILLS`, `STATS`, `TRAINING`
- `PROJECTS` — add an entry and it appears automatically
- `CONTACT` — email, location, GitHub and LinkedIn links

The contact form sends submissions through Brevo (see setup above); if the
endpoint is unavailable it shows a direct email link instead.

## Deployment

The site needs a Node runtime for `/api/contact` because the Brevo key must
stay server-side. Options:

- **Node host** (Render, Railway, Fly.io, VPS): `npm run build` then
  `npm start`. Set `BREVO_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
  and `CONTACT_FROM_NAME` in the host's environment settings.
- **Vercel**: import the repo. `api/contact.js` becomes the serverless
  endpoint automatically. Add the same environment variables in
  **Project → Settings → Environment Variables**.
- **Netlify**: `netlify.toml` builds `dist` and maps `/api/contact` to
  `netlify/functions/contact.mjs`. Add the environment variables in
  **Site configuration → Environment variables**.

Update the canonical URL, Open Graph URLs and sitemap-related files if the
domain changes. A purely static host (no functions) cannot keep the Brevo key
secret; use a platform with serverless functions instead.

## Known follow-ups

- `robots.txt` currently allows indexing; add a `sitemap.xml` after the final
  domain is chosen.
- `og-image.jpg` is portrait-shaped; a 1200×630 landscape image renders better
  in social previews.
- Projects have no screenshots/thumbnails yet; adding them would strengthen
  the projects section.
