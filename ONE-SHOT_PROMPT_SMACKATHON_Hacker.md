ONE-SHOT PROMPT — SMACKATHON 2K26 "The Breach" Hero Experience

You are a Senior Creative Frontend Engineer specializing in Awwwards-winning "Scrollytelling" websites.

Objective: Build a complete, production-ready, single-page hackathon showcase for SMACKATHON 2K26, a cyber-crime themed 24-hour hackathon. The core mechanic is a scroll-controlled image sequence (video-like) that acts as the background, with a "terminal/HUD-style" text overlay that transitions strictly based on scroll progress. The sequence shows a hooded figure with his head lowered, face hidden in shadow → slowly raising his head as the user scrolls → until his face is fully revealed, eyes locked on the viewer, with a slow, unmistakable evil smile completing at 100% scroll. This is not a car or a product — it's a threat reveal, and the pacing/tension should read like a slow-building jump-scare, not a product unveil.

Tech Stack:
Framework: Next.js 14+ (App Router, TypeScript).
Styling: Tailwind CSS v4 (using @theme variables).
Animation: Framer Motion (for all entry/exit animations).
Smooth Scroll: Lenis (npm install @studio-freight/lenis).
Core Logic: HTML5 Canvas + framer-motion useScroll for the image sequence.

Assets Provided:
A folder of 240 frames (images) of a hooded man going from head-down/face-hidden → head rising → face revealed → evil smile in public/images/hacker-sequence/ named 1.webp to 240.webp.

COLOR THEME:
- Primary Background: #0A0A0B (near-black, not pure #000 — softer, more premium)
- Elevated Surface: #161618 (cards, nav backgrounds)
- Primary Text: #E5E5E5 (off-white — never pure white, too harsh against black)
- Secondary Text: #A0A0A0 (gray for subtitles and labels)
- Accent / Highlight Color: #E10600 (primary alert red — buttons, active nav links, border accents, highlighted text)
- Deep Accent: #8B0000 (deep blood red — gradients, borders, hover states)
- Glitch Accent: #FF3B30 (hot red — used sparingly, for live pulse dots and error/alert states only)
- HUD borders and lines: #E10600 and #2A2A2C
- NO white backgrounds anywhere. NO gold. This is a BLACK + RED theme throughout, including all sections after the hero sequence.

═══════════════════════════════════════════════════════
1. PROJECT SETUP & CONFIGURATION
═══════════════════════════════════════════════════════

System:
Initialize a Next.js 14 app with App Router and TypeScript.
Install: npm install framer-motion @studio-freight/lenis clsx tailwind-merge

Fonts: Use Space Grotesk (headings, HUD labels, numbers, buttons) and Inter (body text, descriptions, subtitles) from Google Fonts via next/font/google. Use JetBrains Mono (terminal readouts, countdown timer, phase labels, code-style micro-text) also via next/font/google.

Styling (app/globals.css):
Use Tailwind v4 @theme syntax.
Define these exact CSS variables:

@theme {
  --color-near-black: #0A0A0B;
  --color-surface: #161618;
  --color-off-white: #E5E5E5;
  --color-mid-gray: #A0A0A0;
  --color-border-gray: #2A2A2C;
  --color-breach-red: #E10600;
  --color-breach-red-deep: #8B0000;
  --color-glitch-red: #FF3B30;
  --font-space-grotesk: 'Space Grotesk', sans-serif;
  --font-inter: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

Global styles:
- Background: #0A0A0B
- Text: #E5E5E5
- Selection background: #E10600, selection text: #0A0A0B
- Custom scrollbar: 3px wide, red thumb, near-black track
- html { scroll-behavior: auto; } — Lenis handles smooth scroll
- Add a subtle fixed-position scanline overlay (repeating-linear-gradient, very low opacity ~0.03, pointer-events-none, z-index above canvas but below HUD text) for CRT/surveillance atmosphere

═══════════════════════════════════════════════════════
2. ARCHITECTURE & LOGIC (Critical — Master Scroll)
═══════════════════════════════════════════════════════

We need a Master Scroll Architecture to prevent desync.

app/page.tsx:
- Initializes Lenis smooth scroll in useEffect with duration: 1.4
- Owns the useScroll hook attached to a ref on the 600vh container
- offset: ['start start', 'end end'] so progress = 0 at top, 1 at bottom of sequence
- Passes the same scrollYProgress MotionValue down to both children

HackerScrollCanvas:
- "Dumb" component that renders the correct frame (1–240) based on scrollYProgress
- Uses window.devicePixelRatio to ensure 4K/Retina sharpness (no grainy canvas)
- The hacker images have a near-black studio background — canvas background fill must be #0A0A0B so any edge mismatch is invisible

BreachExperience:
- "Dumb" HUD overlay component
- Transitions content (Intro → Theme → Format → Reveal) based on the same scrollYProgress
- pointer-events-none on the wrapper so scroll passes through

═══════════════════════════════════════════════════════
3. COMPONENT SPECIFICATIONS
═══════════════════════════════════════════════════════

A. components/HackerScrollCanvas.tsx

Props: { scrollYProgress: MotionValue<number>, totalFrames: number, imageFolderPath: string }

Logic:
- Transform scrollYProgress (0 to 1) → frameIndex (0 to 239)
- Use a <canvas> element styled width: 100%, height: 100%
- In useEffect, preload ALL images before showing anything
- Show a loading overlay (near-black bg, red animated scan-line, "ESTABLISHING CONNECTION..." text in JetBrains Mono) until all frames loaded
- Draw image using ctx.drawImage with object-fit: cover logic (fill the viewport, since this is atmosphere not a product shot — no letterboxing)
- CRITICAL High-DPI fix:
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
- Use ResizeObserver on the canvas to handle window resize and redraw
- Only redraw when frameIndex actually changes (compare with currentFrameRef)
- Subscribe to frameIndex changes via frameIndex.on('change', callback)
- Add a very subtle CSS vignette (radial-gradient, dark edges) directly over the canvas wrapper to keep viewer focus centered on the face

B. components/BreachExperience.tsx (The HUD)

Props: { scrollYProgress: MotionValue<number> }

Layout: absolute inset-0, pointer-events-none, z-10

The HUD has a BLACK + RED color scheme, terminal/surveillance styling — not a luxury product HUD.

Phases (use AnimatePresence mode="wait" for transitions):

Phase 1 — 0% to 25% scroll (Intro / Threat Detected):
- Top-left: Small "SIG_01 / DETECTED" label in red JetBrains Mono, tiny tracking-widest, with a blinking red dot before it
- Main title: "SMACKATHON 2K26" in giant off-white Space Grotesk font-black, bottom-left
- Subtitle: "24 HOURS. ONE BREACH." in red Inter tracking-widest below title
- Description: Short text in gray Inter about the hackathon's cyber-crime theme and format
- Right side: Live countdown timer to event start, styled as a terminal readout in JetBrains Mono, red digits
- Two buttons bottom-left (pointer-events-auto):
    1. Solid red button "REGISTER NOW" in off-white Space Grotesk
    2. Outlined off-white button "VIEW TRACKS" in off-white Space Grotesk
- Bottom center: Animated scroll indicator (red vertical line pulsing down, "SCROLL TO DECRYPT" text in JetBrains Mono)

Phase 2 — 25% to 50% scroll (Theme / Case File):
- Label: "SIG_02 / CASE FILE" in red
- Title: "THE THEME" in off-white Space Grotesk large
- Subtitle: "CYBER CRIME" in red
- Description: Text about what participants will build against — privacy, security, decentralization
- Right side badge: "CLASSIFIED" stamped in a bordered box with red corner brackets, slightly rotated for a stamped-document feel

Phase 3 — 50% to 75% scroll (Format / Surveillance):
- Label: "SIG_03 / SURVEILLANCE"
- Title: "MULTI-STAGE HACKATHON" in off-white Space Grotesk large
- Subtitle: "FROM IDEA TO FINAL BUILD" in red
- Description: Text about the round structure — submission, build, present
- Right side: Animated radar-sweep visualization (a rotating line inside a circle, like a scanning radar), with a small "TRACKING" label in red

Phase 4 — 75% to 100% scroll (Reveal / Identity Confirmed):
- Label: "SIG_04 / IDENTIFIED" in red
- Title: "REGISTER NOW" in off-white Space Grotesk large
- Subtitle: "THE BREACH IS YOURS TO COMMIT" in red (this is the payoff moment — make it hit hard, sync its entrance with the smile completing in the canvas frame sequence)
- Description: Final call-to-action text
- Right side: Three stacked stats (TEAMS / PRIZE POOL / HOURS), each with a red underline
- At this exact phase, add a brief full-screen red flash/glitch frame (CSS keyframe, ~150ms, opacity pulse) timed to when the smile fully completes, then settle into the final state

HUD Persistent Elements (always visible, not phase-specific):
- Top-left: UPSURGE logo mark (small bordered box) + "UPSURGE / SMACKATHON 2K26" text in JetBrains Mono
- Top-right: Phase dots — 4 dots, active dot is red filled, inactive are outlined off-white circles
- Scroll progress bar: Thin red line at very top of screen, grows from left to right as user scrolls
- Bottom-right: "CSE DEPARTMENT · YCCE, NAGPUR" in small gray JetBrains Mono

UI Rules:
- Thin 1px red lines as decorators (horizontal bars above titles, corner brackets like evidence-tag markers)
- All caps, wide letter spacing on labels
- Transitions: opacity + translateY + blur filter via Framer Motion AnimatePresence
- Entry animation: y: 30 → 0, opacity: 0 → 1, filter: blur(8px) → blur(0px), duration 0.7s
- Exit animation: y: -20, opacity: 0, filter blur(4px), duration 0.4s

C. components/Navbar.tsx

Fixed at top, z-50.
Left: Red bordered monogram box + "UPSURGE" in off-white Space Grotesk + "SMACKATHON 2K26" in red Inter
Center: Nav links — ABOUT · TRACKS · TIMELINE · JUDGING · REGISTER
  - Active link = red color with red underline
  - Inactive = off-white, hover = red, animated underline on hover
Right: "REGISTER" button — solid red bg, off-white Space Grotesk text, hover fills brighter red (#FF3B30)

On scroll past 80px: glassmorphism background — backdrop-blur-xl, near-black/80 bg, bottom border border-[#2A2A2C]

Entry animation: navbar slides down from y: -100 on mount with 0.3s delay.

D. app/page.tsx (Orchestrator)

Structure:
<main style={{ backgroundColor: '#0A0A0B' }}>
  <Navbar />

  {/* SCROLL SEQUENCE — locked for 600vh */}
  <section ref={containerRef} style={{ height: '600vh', position: 'relative' }}>
    <div className="sticky top-0 h-screen w-full overflow-hidden">
      {/* Layer 0: Canvas z-0 */}
      <HackerScrollCanvas scrollYProgress={scrollYProgress} totalFrames={240} imageFolderPath="/images/hacker-sequence" />
      {/* Layer 1: Scanline texture — very subtle, atmosphere only */}
      <div className="scanline-overlay" style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }} />
      {/* Layer 2: Vignette — just enough for text contrast */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(10,10,11,0.6) 0%, transparent 20%, transparent 75%, rgba(10,10,11,0.85) 100%)'
      }} />
      {/* Layer 3: HUD z-10 */}
      <BreachExperience scrollYProgress={scrollYProgress} />
    </div>
  </section>

  {/* REST OF SITE — scrolls naturally */}
  <div style={{ position: 'relative', zIndex: 20, backgroundColor: '#0A0A0B' }}>
    <TracksGrid />
    <TimelineSection />
    <JudgingSection />
    <Footer />
  </div>
</main>

Lenis init in useEffect:
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.8,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
return () => lenis.destroy();

═══════════════════════════════════════════════════════
4. ADDITIONAL SECTIONS (After Scroll Sequence)
═══════════════════════════════════════════════════════

components/TracksGrid.tsx:
- Near-black background section, id="tracks"
- Section header: thin red line + "PROBLEM SPACE" label in red JetBrains Mono + "CHOOSE YOUR TRACK" heading in off-white, "TRACK" word in red
- 7 track cards in a grid (md:grid-cols-4, wrapping):
  Education, Healthcare, Environment, Fintech, Cyber Defense, Agritech, Open Case
- Each card: surface bg (#161618), 1px border-[#2A2A2C], hover border-red, "FILE_0X" tag in JetBrains Mono, title in Space Grotesk, hover: bottom red border line grows left to right, title turns red
- Animate on scroll into view with useInView (staggered by index * 0.08s)

components/TimelineSection.tsx:
- Near-black background, id="timeline"
- Header: "PROCESS" in red + "HOW THE HACKATHON FLOWS" in off-white with "FLOWS" in red
- 3 numbered steps in vertical/horizontal layout:
  01 · Submit Your Idea — concept deck, problem, approach, value
  02 · Build the Prototype — development, mentoring, iteration
  03 · Present the Final Product — closing round showcase
- Each step: left red border (2px), number in large JetBrains Mono red, title in Space Grotesk
- Animate in from alternating left/right on scroll

components/JudgingSection.tsx:
- Near-black background, id="judging"
- Header: "EVALUATION" in red + "HOW TEAMS ARE JUDGED" in off-white
- 6 criteria as animated horizontal bar rows (Innovation & Originality, Technical Implementation, Problem Understanding, Scalability & Impact, UI/UX & User Experience, Presentation & Q&A)
- Each row: label in Inter, red progress-bar-style fill animating in on scroll (use fixed illustrative weightings, not literal scoring), percentage in JetBrains Mono

components/Footer.tsx:
- Near-black background, top border 1px red
- Left: UPSURGE monogram + "UPSURGE 2K26" + tagline
- Right: "REGISTER YOUR TEAM" solid red button
- Bottom: department credit + tech stack used
- Center top: thin red gradient divider line

═══════════════════════════════════════════════════════
5. DATA FILE (data/hackathonData.ts)
═══════════════════════════════════════════════════════

Export all text content from this single file:

export const hackathonData = {
  brand: "UPSURGE",
  event: "SMACKATHON 2K26",
  tagline: "24 Hours. One Breach.",
  theme: "Cyber Crime",
  department: "CSE Department, YCCE",
  location: "Wanadongri, Nagpur",

  phases: [
    {
      id: "intro",
      scrollRange: [0, 0.25],
      label: "SIG_01 / DETECTED",
      title: "SMACKATHON 2K26",
      subtitle: "24 HOURS. ONE BREACH.",
      description: "Smackathon is the flagship build challenge of UPSURGE 2K26, designed for teams who want to turn a strong idea into a working product and present it on a bigger stage.",
      accent: "REGISTRATION OPENING SOON",
    },
    {
      id: "theme",
      scrollRange: [0.25, 0.50],
      label: "SIG_02 / CASE FILE",
      title: "THE THEME",
      subtitle: "CYBER CRIME",
      description: "Privacy, security, and decentralization — protect the system from the inside. Build tools, defenses, or insight against the threats defining the digital age.",
      accent: "CLASSIFIED",
    },
    {
      id: "format",
      scrollRange: [0.50, 0.75],
      label: "SIG_03 / SURVEILLANCE",
      title: "MULTI-STAGE HACKATHON",
      subtitle: "FROM IDEA TO FINAL BUILD",
      description: "A guided multi-stage experience — from first idea to final showcase. Round 2 is completely free for all teams; only the top teams from Round 1 proceed to the grand finale.",
      accent: "ROUND 1 · ROUND 2 · GRAND FINALE",
    },
    {
      id: "reveal",
      scrollRange: [0.75, 1.0],
      label: "SIG_04 / IDENTIFIED",
      title: "REGISTER NOW",
      subtitle: "THE BREACH IS YOURS TO COMMIT",
      description: "Shortlisted teams complete the next step after selection. Round 2 is free for all teams.",
      accent: "OPENING SOON",
    },
  ],

  tracks: [
    { file: "FILE_01", title: "Education", description: "Case files on access to learning — tools that make education reach further and fairer." },
    { file: "FILE_02", title: "Healthcare", description: "Evidence for public health gear — wellness, access, and early-warning systems." },
    { file: "FILE_03", title: "Environment", description: "Field reports on sustainability — tech that lessens the load on the planet." },
    { file: "FILE_04", title: "Fintech", description: "Follow the money — inclusion, financial evolution, fraud defense." },
    { file: "FILE_05", title: "Cyber Defense", description: "Privacy, security, and decentralization — protect the system from the inside." },
    { file: "FILE_06", title: "Agritech", description: "Ground-level intelligence for farming — efficiency and sustainability in the field." },
    { file: "FILE_07", title: "Open Case", description: "No track. Bring your own lead. Any domain, any approach, wide open." },
  ],

  timeline: [
    { number: "01", title: "Submit Your Idea", description: "Start with your concept deck and clearly show the problem, approach, and value." },
    { number: "02", title: "Build the Prototype", description: "Shortlisted teams move into development with mentoring, iteration, and review." },
    { number: "03", title: "Present the Final Product", description: "The best teams showcase their finished solution in the closing round." },
  ],

  judging: [
    { label: "Innovation & Originality", description: "A genuinely fresh angle on the problem." },
    { label: "Technical Implementation", description: "Code quality, design, and overall execution." },
    { label: "Problem Understanding", description: "Depth of research and grasp of the problem." },
    { label: "Scalability & Practical Impact", description: "How well the solution can scale in the real world." },
    { label: "UI/UX & User Experience", description: "Design thoughtfulness and user journey." },
    { label: "Presentation & Q&A", description: "Clarity of the pitch and ability to defend the idea." },
  ],

  navLinks: ["ABOUT", "TRACKS", "TIMELINE", "JUDGING", "REGISTER"],
};

═══════════════════════════════════════════════════════
6. FILES TO GENERATE — IN THIS EXACT ORDER
═══════════════════════════════════════════════════════

Generate complete, copy-paste-ready code for:

1. app/layout.tsx — Space Grotesk + Inter + JetBrains Mono fonts, metadata, html/body
2. app/globals.css — Tailwind v4 @theme, utilities (glow-red, corner-bracket, scanlines, scrollbar)
3. data/hackathonData.ts — All text content as typed exports
4. lib/utils.ts — cn(), clampValue(), getPhaseProgress() helpers
5. components/Navbar.tsx — Fixed, glassmorphism on scroll, red active states
6. components/HackerScrollCanvas.tsx — High-DPI canvas, 240 frame preload, near-black bg
7. components/BreachExperience.tsx — 4-phase HUD, AnimatePresence, black+red theme
8. components/TracksGrid.tsx — 7 cards, stagger animation, red hover
9. components/TimelineSection.tsx — 3 steps, left red border, scroll animation
10. components/JudgingSection.tsx — 6 animated criteria bars
11. components/Footer.tsx — Near-black bg, red top border, CTA button
12. app/page.tsx — Lenis init, useScroll on containerRef, 600vh section, passes scrollYProgress to both canvas and experience

═══════════════════════════════════════════════════════
7. CRITICAL RULES — DO NOT SKIP ANY
═══════════════════════════════════════════════════════

RULE 1 — High-DPI Canvas (mandatory):
const dpr = window.devicePixelRatio || 1;
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
ctx.scale(dpr, dpr);
// CSS stays: width: '100%', height: '100%'
Without this, canvas looks blurry on MacBook Retina screens.

RULE 2 — Canvas background must be NEAR-BLACK:
ctx.fillStyle = '#0A0A0B';
ctx.fillRect(0, 0, cssWidth, cssHeight);
// Then draw image on top — hacker frames have a near-black studio backdrop

RULE 3 — Master scroll — no desync:
useScroll must attach to containerRef (the 600vh div), NOT window.
Both HackerScrollCanvas and BreachExperience receive the EXACT SAME scrollYProgress MotionValue — do not create separate hooks.

RULE 4 — Lenis compatibility:
Do NOT set scroll-behavior: smooth on html — Lenis handles it.
Lenis RAF loop must be inside useEffect with cleanup: lenis.destroy().

RULE 5 — Phase detection in BreachExperience:
Subscribe to scrollYProgress via .on('change', callback) inside useEffect.
Determine active phase by checking which scrollRange bracket the value falls in.
Use AnimatePresence mode="wait" so phase content fully exits before next enters.

RULE 6 — Performance:
Only redraw canvas when frameIndex changes (compare with useRef).
Use useInView from framer-motion for all below-fold section animations.
Lenis wheelMultiplier: 0.8 for a heavier, premium scroll feel.
Compress all 240 frames to WebP (~60-70% quality) before shipping — do not preload 240 raw PNGs.

RULE 7 — Color consistency:
Red = #E10600 (with #FF3B30 for rare high-intensity glitch/alert moments) — used ONLY for: active nav links, button backgrounds, accent labels, decorative lines, phase labels, highlighted subtitle text
Off-white = #E5E5E5 — main titles, body text (never pure #FFFFFF)
Gray = #A0A0A0 — descriptions, secondary labels
Near-black = #0A0A0B — all backgrounds
Never use pure black (#000000). Never use pure white (#FFFFFF). Never use any color outside this red/black/gray system — no blue, no green, no gold.

RULE 8 — Typography consistency:
Space Grotesk → EVERY heading (h1, h2, h3), every button text
JetBrains Mono → EVERY HUD label, phase tag, number/stat, countdown timer, file tag
Inter → EVERY description paragraph, every body sentence, every subtitle tagline
Apply font via style={{ fontFamily: 'var(--font-space-grotesk)' }} since Tailwind v4 custom font variables may need inline style for reliability.

RULE 9 — Scroll hint animation:
Phase 1 (Intro) must show a bottom-center scroll indicator:
A vertical red line that pulses downward + "SCROLL TO DECRYPT" text in JetBrains Mono below it.
It must disappear (opacity → 0) once scroll progress passes 0.05.

RULE 10 — The payoff moment (unique to this build, do not omit):
At scroll progress ~0.92–1.0, synchronize three things to land together: (a) the canvas frame sequence completing the smile, (b) the Phase 4 HUD content entering, (c) the brief full-screen red glitch/flash keyframe. This synchronized beat is the single most important moment on the page — do not let any of the three fire out of sync with the others.

RULE 11 — Smooth, premium animation feel:
ALL Framer Motion transitions use this easing: ease: [0.16, 1, 0.3, 1]
Phase entry: { y: 30, opacity: 0, filter: 'blur(8px)' } → { y: 0, opacity: 1, filter: 'blur(0px)' }, duration 0.7
Phase exit: { y: -20, opacity: 0, filter: 'blur(4px)' }, duration 0.4
Stagger children inside each phase panel with staggerChildren: 0.08
Navbar entry: y: -100 → 0, delay 0.3s, duration 1s

Tone: Premium, minimal, quiet menace. Black and red. Sharp edges. Deliberate pacing.
This is a portfolio-grade project for a college hackathon. Every pixel must be intentional. Every animation deliberate.
