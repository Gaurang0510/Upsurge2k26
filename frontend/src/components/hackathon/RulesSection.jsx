import ScrollFade, { ScrollStaggerContainer, ScrollStaggerItem } from '../common/ScrollFade.jsx';

// Inline SVG Icons for each rule
const RULE_ICONS = [
  // 01: Team size
  <svg key="0" className="w-5 h-5 text-evidence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>,
  // 02: Single team
  <svg key="1" className="w-5 h-5 text-evidence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>,
  // 03: Originality
  <svg key="2" className="w-5 h-5 text-evidence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>,
  // 04: Open source / attribution
  <svg key="3" className="w-5 h-5 text-evidence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>,
  // 05: Offline registration deadline
  <svg key="4" className="w-5 h-5 text-evidence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>,
  // 06: Accommodation
  <svg key="5" className="w-5 h-5 text-evidence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>,
  // 07: Online participation
  <svg key="6" className="w-5 h-5 text-evidence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>,
  // 08: Student ID
  <svg key="7" className="w-5 h-5 text-evidence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
  </svg>,
  // 09: Problem statement
  <svg key="8" className="w-5 h-5 text-evidence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>,
  // 10: Git repository
  <svg key="9" className="w-5 h-5 text-evidence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>,
  // 11: Judges final
  <svg key="10" className="w-5 h-5 text-evidence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>,
  // 12: Disqualification
  <svg key="11" className="w-5 h-5 text-evidence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>,
  // 13: Schedule modification
  <svg key="12" className="w-5 h-5 text-evidence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>,
  // 14: Timings & reporting
  <svg key="13" className="w-5 h-5 text-evidence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
  // 15: Evaluation time
  <svg key="14" className="w-5 h-5 text-evidence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
  // 16: Media consent
  <svg key="15" className="w-5 h-5 text-evidence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
  </svg>,
];

// Keywords to highlight in red for each rule
const RULE_HIGHLIGHTS = [
  '3–5 members',
  'one team',
  'original',
  'attribution',
  'before the deadline',
  'offline registration',
  "organizers' discretion",
  'ID cards',
  'problem statement',
  'Git repository',
  'final and binding',
  'disqualification',
  'modify schedules',
  'timings and reporting',
  'allotted time',
  'media coverage',
];

/**
 * Format rule text with bold red highlighted keywords
 */
function formatRuleText(text, highlight) {
  if (!highlight || !text.includes(highlight)) {
    return text;
  }
  const parts = text.split(highlight);
  return (
    <>
      {parts[0]}
      <span className="text-evidence font-semibold">{highlight}</span>
      {parts[1]}
    </>
  );
}

export default function RulesSection({ rules }) {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Top Section Header */}
      <ScrollFade direction="up" className="flex flex-col items-start max-w-3xl mb-12 sm:mb-16">
        <span className="case-tag mb-3">{"//"} RULES & REGULATIONS</span>
        <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-white uppercase tracking-wide">
          RULES <span className="text-evidence">OF THE GAME</span>
        </h2>
        <p className="mt-3 text-base sm:text-lg text-steel">
          Read them. Hack them. <span className="text-evidence font-semibold">Follow them.</span>
        </p>
      </ScrollFade>

      {/* Grid of Rule Cards (2-column cyberpunk chamfered layout) */}
      <ScrollStaggerContainer className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        {rules.map((ruleText, index) => {
          const icon = RULE_ICONS[index % RULE_ICONS.length];
          const highlight = RULE_HIGHLIGHTS[index % RULE_HIGHLIGHTS.length];
          const itemNum = String(index + 1).padStart(2, '0');

          return (
            <ScrollStaggerItem key={ruleText} direction="up">
              <div className="group relative bg-black/60 backdrop-blur-md border border-white/10 hover:border-evidence/60 rounded-xl p-5 sm:p-6 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(193,18,31,0.2)] flex items-center gap-4 sm:gap-5 overflow-hidden">
                {/* Red corner bracket accents on hover */}
                <div className="pointer-events-none absolute top-1 right-2 font-mono text-[10px] text-evidence opacity-0 group-hover:opacity-100 transition-opacity">
                  ┌
                </div>
                <div className="pointer-events-none absolute bottom-1 left-2 font-mono text-[10px] text-evidence opacity-0 group-hover:opacity-100 transition-opacity">
                  └
                </div>

                {/* Left Number Badge */}
                <div className="shrink-0 flex items-center justify-center w-11 h-11 bg-white/5 border border-white/15 group-hover:border-evidence/40 rounded-lg font-mono text-sm text-white font-bold transition-colors">
                  {itemNum}
                </div>

                {/* Rule Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base leading-snug text-paper/90 group-hover:text-white transition-colors">
                    {formatRuleText(ruleText, highlight)}
                  </p>
                </div>

                {/* Right Topic Icon */}
                <div className="shrink-0 p-2.5 bg-evidence/10 group-hover:bg-evidence/20 border border-evidence/20 rounded-lg transition-colors">
                  {icon}
                </div>
              </div>
            </ScrollStaggerItem>
          );
        })}
      </ScrollStaggerContainer>

      {/* Bottom Cyber Warning Callout Banner */}
      <ScrollFade direction="up" delay={0.2} className="mt-12 sm:mt-16">
        <div className="relative bg-ink/90 border border-evidence/40 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(193,18,31,0.2)] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="noise-overlay" />

          {/* Left Alert Message */}
          <div className="flex items-center gap-4 sm:gap-6 relative z-10">
            <div className="p-3 sm:p-4 bg-evidence/20 border border-evidence/40 rounded-xl text-evidence shrink-0">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-evidence font-bold block">
                REMEMBER
              </span>
              <p className="mt-1 text-base sm:text-lg font-medium text-white">
                This isn&apos;t just a hackathon. <span className="text-steel">It&apos;s a cyber battleground.</span>
              </p>
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="hidden md:block w-px h-12 bg-white/10 shrink-0" />

          {/* Right Tagline */}
          <div className="flex items-center gap-4 relative z-10 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/70">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457-.39-2.823-1.07-4" />
              </svg>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs uppercase tracking-widest text-steel block">
                THINK. CODE. SECURE.
              </span>
              <span className="font-display text-lg sm:text-xl uppercase tracking-wider text-evidence font-bold block">
                LET THE HACK BEGIN.
              </span>
            </div>
          </div>
        </div>
      </ScrollFade>
    </div>
  );
}
