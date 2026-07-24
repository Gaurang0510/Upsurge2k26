# Task Division — Web Team (3 Members)

This split is designed around one rule: **two people should rarely need to
edit the same file in the same week.** Ownership maps directly onto
`.github/CODEOWNERS` — GitHub will auto-request the right reviewer on every
PR once you swap in real usernames there.

Rename these three roles to real names once assigned; keep the
responsibilities and file ownership as-is unless your team agrees to
restructure.

---

## Member 1 — Pages, Routing & Deployment Lead

**Owns:** `/src/pages/`, `/src/routes/`, `/src/layouts/`, `index.html`,
`vite.config.js`, hosting/deployment setup.

**Responsibilities:**

- Build and maintain every page's overall composition (Home, Hackathon,
  Schedule, Team, 404) — assembling components built by Member 2 with data
  from Member 3.
- Own `AppRoutes.jsx` — adding new routes when a new page is needed.
- Set up and maintain the Railway deployment (GitHub Auto Deploy, custom
  domain, environment config).
- Run point on the `main` branch — the only person who merges
  `develop → main` for a release (see `GIT_WORKFLOW.md`).
- Cross-browser / cross-device QA before each release.

**First milestones:**

- [ ] Confirm all 7 routes render with placeholder data
- [ ] Connect a hosting project and get a staging URL live from `develop`
- [ ] Add real registration link handling once forms/backend are decided

---

## Member 2 — Components & Design System Lead

**Owns:** `/src/components/`, `/src/styles/`, `tailwind.config.js`,
`postcss.config.js`.

**Responsibilities:**

- Own the visual design system — colors, type, spacing, the `.btn-*` /
  `.file-card` classes in `src/styles/index.css`, and the `RedactedText`
  signature interaction.
- Build and refine all reusable components (`EventCard`, `TeamCard`,
  `ScheduleTimeline`, `Navbar`, `Footer`, etc.) — these are consumed by
  Member 1's pages, so keep prop shapes stable and communicate before
  renaming a prop.
- Responsive and accessibility polish (mobile nav, focus states, contrast,
  reduced-motion) across the whole site.
- Any new global animation/interaction pattern gets proposed here first —
  keep it to the one signature motif per the design notes in the README.

**First milestones:**

- [ ] Audit every component at 360px, 768px, 1280px widths
- [ ] Confirm keyboard navigation works through the mobile menu and FAQ accordion
- [ ] Add loading/empty states where data might be missing (e.g. sponsors)

---

## Member 3 — Data & Content Lead

**Owns:** `/src/data/`, `/public/images/`, `/public/videos/`.

**Responsibilities:**

- The single point of contact with the non-tech committee (Event
  Management, Design, Sponsorship teams) for real content: event details,
  dates, prize amounts, team member info, sponsor logos, photos.
- Keep every event's data file accurate and complete — one file per event
  in `src/data/events/`, by design, so this can happen without touching
  any component code.
- Maintain `src/data/team/`, `schedule.js`, `sponsors.js`, `faq.js`, and
  `site.js` (the one file with contact info, socials, and nav labels).
- Own the `public/images/` and `public/videos/` folders — collecting,
  compressing, and correctly naming assets so they match the paths
  referenced in the data files.

**First milestones:**

- [ ] Replace every `TBD` in `src/data/site.js` with confirmed info
- [ ] Collect and drop in real cover/thumbnail images for all 13 events
- [ ] Replace placeholder team entries in `src/data/team/` with the real
      2K26 committee (get consent before adding anyone's contact info)

---

## Shared responsibilities (all 3)

- Every PR needs review from at least one other member before merging to
  `develop` (see `GIT_WORKFLOW.md`).
- Anyone touching `package.json`, `.github/`, or root config files should
  flag it in the team channel first — these are reviewed by all 3.
- Weekly sync (15 min) to walk through what shipped, what's blocked, and
  whether the ownership split above still makes sense as the site grows.
