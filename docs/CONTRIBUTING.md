# Contributing

This is a 3-person team project — full process docs live in:

- **`TASK_DIVISION.md`** — who owns which part of the codebase.
- **`GIT_WORKFLOW.md`** — branching model, commit convention, PR flow, and
  how to resolve a merge conflict if you hit one.

## Code conventions

- **Components**: PascalCase filenames, one component per file
  (`EventCard.jsx`, not `eventCard.jsx` or multiple components in one file).
- **Data files**: kebab-case filenames matching the entity's slug
  (`cage-match.js`, `technical-team.js`).
- **Styling**: Tailwind utility classes directly in JSX. Reach for a new
  class in `src/styles/index.css`'s `@layer components` block only when a
  pattern (like `.file-card`) repeats across 3+ places — don't invent new
  one-off custom CSS per component.
- **No inline hex colors** — always use the theme tokens from
  `tailwind.config.js` (`bg-evidence`, `text-breach`, etc.) so the palette
  stays consistent and easy to retheme later.
- **Restraint on animation** — `RedactedText` is the one signature motif.
  New pages/components should reuse it rather than introducing another big
  animated effect; small, purposeful hover/transition states are fine.

## Before opening a PR

```bash
npm run lint
npm run build
```

Both must pass — CI will block the merge otherwise. See the PR template
for the full checklist.
