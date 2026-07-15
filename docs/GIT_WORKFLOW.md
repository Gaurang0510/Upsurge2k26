# Git Workflow — UPSURGE 2K26 Web Team

A lightweight branching model for a 3-person team, built to minimize merge
conflicts by pairing with the file ownership in `TASK_DIVISION.md`. Read
that file first — this doc is about *how* you ship, not *who* owns what.

---

## 1. Branch model

```
main        ─────●──────────────●──────────────●───────────▶  production (live site)
                   \            / \            /
develop     ────●───●──●───●──●───●──●───●──●─────────────▶  integration branch (default)
                 \   \  \      \   \  \
feature/...       ●   ●  ●      ●   ●  ●                      short-lived work branches
```

| Branch           | Purpose                                          | Protected? |
| ----------------- | ------------------------------------------------- | ---------- |
| `main`            | Always matches what's live on the production URL. | Yes — no direct pushes, no force-push. |
| `develop`         | Integration branch. Default branch for the repo.  | Yes — no direct pushes; PRs only. |
| `feature/<name>/<short-desc>` | One unit of work.                    | No |
| `fix/<short-desc>`| A bug fix, same rules as `feature/*`.             | No |
| `hotfix/<short-desc>` | Urgent fix branched from `main` directly, for when the live site is broken. | No |

**Branch naming examples:**

```
feature/member2/event-card-hover-state
feature/member3/add-cage-match-event
fix/mobile-nav-overlap
hotfix/broken-register-link
```

Prefixing with the member name is optional but makes `git branch -a` easy
to scan on a 3-person team — pick a convention and stick to it.

---

## 2. One-time setup

```bash
git clone <repo-url>
cd upsurge-2k26
git checkout develop
npm install
```

Set your name/email once globally if you haven't:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

---

## 3. Daily workflow

```bash
# 1. Start from an up-to-date develop
git checkout develop
git pull origin develop

# 2. Branch for your task
git checkout -b feature/member3/add-manhunt-prize-pool

# 3. Work, committing in small, logical chunks
git add src/data/events/manhunt.js
git commit -m "feat(events): add confirmed prize pool for Manhunt"

# 4. Before opening a PR, sync with develop again to catch conflicts early
git checkout develop
git pull origin develop
git checkout feature/member3/add-manhunt-prize-pool
git rebase develop
# resolve anything here, on your own branch, before anyone reviews it

# 5. Push and open a PR into develop
git push origin feature/member3/add-manhunt-prize-pool
```

Open the PR on GitHub targeting `develop`. The PR template
(`.github/PULL_REQUEST_TEMPLATE.md`) walks you through the checklist.
CODEOWNERS will auto-tag the right reviewer; CI (`.github/workflows/ci.yml`)
must pass (lint + build) before merge.

**Merge strategy:** use **Squash and merge** into `develop`. It keeps
`develop`'s history to one clean commit per feature, which makes
`git log` and `git bisect` actually usable later. Delete the branch after
merging (GitHub can do this automatically — enable it in repo settings).

---

## 4. Commit message convention

Use [Conventional Commits](https://www.conventionalcommits.org/) — short,
consistent, and it makes the squashed `develop` history genuinely readable:

```
feat(events): add Cipher Heist event data
fix(nav): close mobile menu on route change
style(team): tighten grid gap on TeamCard
docs(readme): update setup instructions
chore(deps): bump vite to 5.3.3
```

Types: `feat`, `fix`, `style`, `refactor`, `docs`, `chore`, `test`.

---

## 5. Why conflicts should be rare here

This project's file structure was deliberately split to avoid conflicts,
not just for tidiness:

- **One file per event** (`src/data/events/*.js`) — Member 3 can add or
  edit any single event without touching the file anyone else is editing.
  The only shared file is the tiny `index.js` aggregator, and merge
  conflicts there are a one-line fix (see §6).
- **One file per team department** (`src/data/team/*.js`) — same reasoning.
- **CODEOWNERS + TASK_DIVISION.md** — component work, page work, and data
  work live in different folders owned by different people, so two people
  are rarely editing the same file at the same time in the first place.
- **Small, frequent PRs** — a PR that touches 3 files merges cleanly; a PR
  that touches 30 files sitting open for a week is where conflicts breed.
  Rebase onto `develop` daily if your branch lives more than a day.

---

## 6. If you DO hit a merge conflict

Don't panic — most conflicts here will be a two-line `index.js` import
list. Steps:

```bash
git checkout develop
git pull origin develop
git checkout your-branch
git rebase develop
```

Git will stop on the first conflicting file and mark it like this:

```js
<<<<<<< HEAD
import cageMatch from './cage-match.js';
=======
import manhunt from './manhunt.js';
>>>>>>> feature/member3/add-manhunt-prize-pool
```

1. Open the file, keep **both** lines (this is almost always the fix for
   `index.js` conflicts — someone added an event, so did you), delete the
   `<<<<<<<`, `=======`, `>>>>>>>` markers.
2. Do the same for the corresponding entry further down in the array.
3. Stage the resolved file and continue the rebase:
   ```bash
   git add src/data/events/index.js
   git rebase --continue
   ```
4. Run `npm run dev` and sanity-check the page before pushing.
5. Push with `git push --force-with-lease origin your-branch` (safe
   force-push — only overwrites your own branch, never `develop`/`main`).

If a conflict shows up in a shared component file and you're not sure
which version is correct, **don't guess** — ping whoever owns that file
per `TASK_DIVISION.md` before resolving.

---

## 7. Releasing to production

Only Member 1 (Pages, Routing & Deployment Lead) merges `develop → main`:

```bash
git checkout main
git pull origin main
git merge --no-ff develop
git tag -a v1.1.0 -m "Events page + schedule live"
git push origin main --tags
```

Tag using [semver](https://semver.org/)-ish versioning (`v1.0.0`,
`v1.1.0`, etc.) so it's easy to point to "what was live during
registration week" later.

---

## 8. Quick command reference

| Task                          | Command |
| ------------------------------ | ------- |
| Start new work                 | `git checkout develop && git pull && git checkout -b feature/...` |
| Save progress                  | `git add -A && git commit -m "feat(...): ..."` |
| Update your branch with latest develop | `git checkout develop && git pull && git checkout - && git rebase develop` |
| Push your branch                | `git push origin feature/...` |
| Push after a rebase             | `git push --force-with-lease origin feature/...` |
| Abandon local changes on a file | `git checkout -- path/to/file` |
| See what changed vs develop     | `git diff develop` |
