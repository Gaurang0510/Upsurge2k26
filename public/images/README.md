# /public/images

Everything in this folder is served as-is (no build processing), so keep
filenames exactly matching what the data files expect.

## Structure

```
images/
├── events/<event-slug>/cover.jpg     # 1600x900 recommended, hero banner
├── events/<event-slug>/thumb.jpg     # 800x450 recommended, card thumbnail
├── sponsors/<tier>-<name>.png        # flat logo, transparent background
├── team/<department-slug>/<name>.jpg # square, min 400x400, will be cropped to a circle
├── gallery/                          # past-event / promo photos for any future gallery page
└── logo/                             # site logo + favicon (already populated)
```

## Rules for the team

1. **Match the slug.** Every event's `slug` field in `/src/data/events/*.js` and
   every path referenced there (`image`, `thumbnail`) must match a real file here
   before deploying — the demo currently points at paths that don't exist yet,
   which is expected until real photos come in.
2. **Compress before committing.** Run photos through TinyPNG/Squoosh first.
   Large uncommitted raw photos bloat the git history for everyone.
3. **No copyrighted or stock imagery** without a license you can prove — sponsor
   logos should come directly from the sponsor.
4. **Team photos**: square crop, plain/neutral background preferred since the
   UI applies a circular mask + grayscale filter.

## Who owns this folder

Per `/docs/TASK_DIVISION.md`, this is jointly owned by whoever is
coordinating with Event Management / Photography for real assets — usually
the Data & Content lead. Keep new PRs to this folder scoped to images only,
so they don't collide with anyone editing `/src`.
