# /public/videos

Background/hero videos and promo reels go here.

## Guidelines

- Keep hero/background videos **short (under 15s), muted, and looping** —
  export as `.webm` (primary) with an `.mp4` fallback for Safari.
- Compress aggressively (aim under 5MB for anything auto-playing on the
  homepage or hackathon page hero). Large video files are the #1 cause of a
  slow-loading fest site.
- Raw/unedited footage should NOT be committed to git — it belongs in the
  team's shared drive. Only the final, compressed, ready-to-ship file goes
  here (this folder's `raw/` subfolder is already excluded via `.gitignore`).

## Naming

```
videos/
├── hackathon-bg.webm   # loops behind the Operation Breach hero
├── hackathon-bg.mp4    # Safari fallback
└── promo-2k26.mp4      # optional full promo reel, linked from Home if added later
```
