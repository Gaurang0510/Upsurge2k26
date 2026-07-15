# UPSURGE 2K26

**Theme: Crime & Cyber Crime.** The CSE Department, YCCE techfest — reimagined
as a citywide crime investigation. Thirteen events, one flagship 24-hour
hackathon ("Operation Breach"), and a design language built around case
files, redacted documents, and hacker terminals.

This repo is a **working demo / starter build** — routing, styling, data
structure, and every page are wired up and functional. What's still
missing on purpose: real photos/videos, real team member info, confirmed
dates, prize amounts, and registration links (all marked `TBD` — see
`docs/TASK_DIVISION.md`).

> Built as a starting point for the 2K26 web team to extend. Nothing here
> is final — reskin, restructure, or rip out anything that doesn't serve
> the fest.

---

## Tech stack

| Layer      | Choice                                    |
| ---------- | ------------------------------------------ |
| Framework  | React 18 (via Vite)                        |
| Routing    | React Router v6                            |
| Styling    | Tailwind CSS (custom theme, no UI kit)     |
| Data       | Plain JS modules (no backend/CMS required) |
| Deployment | Any static host — Vercel/Netlify recommended |

No backend is required to run this site — all content lives in
`/src/data/` as JS files. If a registration backend or CMS is added later,
that's a separate integration layer on top of this.

## Getting started

```bash
npm install
npm run dev       # starts the dev server at http://localhost:5173
```

Other scripts:

```bash
npm run build      # production build -> /dist
npm run preview    # preview the production build locally
npm run lint        # run ESLint
```

## Folder structure

```
upsurge-2k26/
├── public/
│   ├── images/            # events/, sponsors/, team/, gallery/, logo/ — see public/images/README.md
│   └── videos/            # hero/background video files — see public/videos/README.md
├── src/
│   ├── assets/            # icons/SVGs used inline in components
│   ├── components/
│   │   ├── common/         # Navbar, Footer, SectionHeading, RedactedText, Logo
│   │   ├── home/            # Hero, EventsPreview, StatusTicker
│   │   ├── events/          # EventCard, EventFilterTabs
│   │   ├── schedule/        # ScheduleTimeline
│   │   ├── team/             # TeamCard, TeamSection
│   │   └── hackathon/        # TrackCard (flagship-page-only pieces)
│   ├── data/
│   │   ├── events/            # ONE FILE PER EVENT + index.js aggregator
│   │   ├── team/               # ONE FILE PER DEPARTMENT + index.js aggregator
│   │   ├── schedule.js
│   │   ├── sponsors.js
│   │   ├── faq.js
│   │   └── site.js             # nav links, contact info, socials — single source of truth
│   ├── pages/                  # one folder per route (Home, Events, EventDetail, Hackathon, Schedule, Team, NotFound)
│   ├── layouts/MainLayout.jsx  # Navbar + StatusTicker + page content + Footer
│   ├── routes/AppRoutes.jsx    # the route table
│   ├── hooks/                  # useDocumentTitle, add more here as needed
│   ├── styles/index.css        # Tailwind entry + reusable component classes (.btn-primary, .file-card, etc.)
│   ├── App.jsx
│   └── main.jsx
├── docs/
│   ├── GIT_WORKFLOW.md         # branching model, PR flow, conflict avoidance
│   ├── TASK_DIVISION.md        # what each of the 3 web team members owns
│   └── CONTRIBUTING.md
├── .github/
│   ├── workflows/ci.yml        # lint + build check on every PR
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
└── tailwind.config.js          # the crime/cyber-crime design tokens live here
```

## How to add or edit an event

1. Duplicate any file in `src/data/events/` (e.g. `cage-match.js`) as a
   template, or edit the existing one directly.
2. Fill in every field — see the schema comment at the top of
   `src/data/events/operation-breach.js`.
3. If it's a **new** event, import it and add it to the `events` array in
   `src/data/events/index.js`.
4. Drop `cover.jpg` and `thumb.jpg` into `public/images/events/<slug>/`
   (see `public/images/README.md` for sizing).

The page, card, filter, and detail route all pick this up automatically —
no other file needs to change.

## How to add or edit a team member

Edit the relevant file in `src/data/team/` (e.g. `technical-team.js`) and
add/update an entry. Drop their photo into `public/images/team/`.

## Design language (for anyone extending the UI)

The full token system — colors, fonts, animations — lives in
`tailwind.config.js` with inline comments. Quick reference:

- **Colors**: `case-black` (bg), `ink` (surfaces), `evidence` (yellow —
  primary accent), `breach` (red — danger/CTA), `terminal` (green —
  cybersecurity accent), `paper` (off-white text/accents), `steel` (muted
  text).
- **Type**: `font-display` (Bebas Neue, headlines), `font-body` (Inter,
  copy), `font-mono` (JetBrains Mono, case numbers/data/labels).
- **Signature interaction**: `<RedactedText>` in `src/components/common/`
  — a black bar that wipes away to reveal text, like a declassified case
  file. Reused for hero copy and key descriptions. Don't scatter more
  large animated effects around it — see `docs/CONTRIBUTING.md`.

## Deployment

Any static host works (Vercel, Netlify, GitHub Pages, Cloudflare Pages).
For Vercel/Netlify: connect the repo, framework preset "Vite", build
command `npm run build`, output directory `dist`. No environment
variables are required for the current build.

## Team workflow

See `docs/TASK_DIVISION.md` for who owns what, and `docs/GIT_WORKFLOW.md`
for the branching model and how the 3 of you merge without stepping on
each other.
