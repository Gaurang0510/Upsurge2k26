import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FuzzyText from '../FuzzyText.jsx';

const PHASES = [
  {
    id: 'intro',
    range: [0, 0.25],
    label: 'SIG_01 / DETECTED',
    title: 'SMACKATHON 2K26',
    subtitle: '24 HOURS. ONE BREACH.',
    description:
      'Smackathon is the flagship build challenge of UPSURGE 2K26, designed for teams who want to turn a strong idea into a working product and present it on a bigger stage.',
  },
  {
    id: 'theme',
    range: [0.25, 0.5],
    label: 'SIG_02 / CASE FILE',
    title: 'THE THEME',
    subtitle: 'CYBER CRIME',
    description:
      'Privacy, security, and decentralization — protect the system from the inside. Build tools, defenses, or insight against the threats defining the digital age.',
  },
  {
    id: 'format',
    range: [0.5, 0.75],
    label: 'SIG_03 / SURVEILLANCE',
    title: 'MULTI-STAGE HACKATHON',
    subtitle: 'FROM IDEA TO FINAL BUILD',
    description:
      'A guided multi-stage experience — from first idea to final showcase. Round 2 is completely free for all teams; only the top teams from Round 1 proceed to the grand finale.',
  },
  {
    id: 'reveal',
    range: [0.75, 1.0],
    label: 'SIG_04 / IDENTIFIED',
    title: '',
    subtitle: '',
    description:
      'Shortlisted teams complete the next step after selection. Round 2 is free for all teams. The breach window is open.',
  },
];

const EASE = [0.16, 1, 0.3, 1];

const phaseVariants = {
  enter:   { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: 0.65, ease: EASE, staggerChildren: 0.07 } },
  exit:    { opacity: 0, y: -20, filter: 'blur(4px)',
    transition: { duration: 0.35, ease: EASE } },
};

const childVariants = {
  enter:   { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  exit:    { opacity: 0 },
};

function getPhaseIndex(v) {
  for (let i = PHASES.length - 1; i >= 0; i--) {
    if (v >= PHASES[i].range[0]) return i;
  }
  return 0;
}

/* ── Sub-components ── */

function BlinkDot() {
  return (
    <span style={{
      display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
      background: '#E10600', marginRight: 8,
      animation: 'hud-blink 1s steps(1) infinite',
    }} />
  );
}

function PhaseDots({ active }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {PHASES.map((_, i) => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: i === active ? '#E10600' : 'transparent',
          border: `2px solid ${i === active ? '#E10600' : '#E5E5E5'}`,
          transition: 'all 0.25s ease',
          boxShadow: i === active ? '0 0 8px #E10600' : 'none',
        }} />
      ))}
    </div>
  );
}

function ClassifiedStamp({ isMobile }) {
  return (
    <div style={{
      border: '2px solid #E10600', padding: isMobile ? '0.6rem 1rem' : '1rem 1.5rem',
      transform: 'rotate(-6deg)', display: 'inline-flex',
    }}>
      <span style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: isMobile ? '1rem' : '1.5rem', fontWeight: 700, letterSpacing: '0.4em',
        color: '#E10600', textShadow: '0 0 16px rgba(225,6,0,0.4)',
      }}>
        CLASSIFIED
      </span>
    </div>
  );
}

function RadarSweep({ isMobile }) {
  const size = isMobile ? 90 : 130;
  const c = size / 2;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" style={{ position: 'absolute', inset: 0 }}>
        {[c, c * 0.74, c * 0.46].map(r => (
          <circle key={r} cx={c} cy={c} r={r} stroke="#E10600" strokeOpacity="0.25" strokeWidth="1"/>
        ))}
        <line x1={c} y1="0" x2={c} y2={size} stroke="#E10600" strokeOpacity="0.12" strokeWidth="0.5"/>
        <line x1="0" y1={c} x2={size} y2={c} stroke="#E10600" strokeOpacity="0.12" strokeWidth="0.5"/>
        <line x1={c} y1={c} x2={c} y2="0" stroke="#E10600" strokeWidth="1.5"
          style={{ transformOrigin: `${c}px ${c}px`, animation: 'radar-sweep 3s linear infinite' }}
        />
        <circle cx={c * 1.35} cy={c * 0.58} r="2.5" fill="#FF3B30" style={{ animation: 'hud-blink 0.8s steps(1) infinite' }}/>
      </svg>
      <div style={{
        position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)',
        fontFamily: '"JetBrains Mono", monospace', fontSize: isMobile ? '0.5rem' : '0.6rem',
        letterSpacing: '0.3em', color: '#E10600', whiteSpace: 'nowrap',
      }}>TRACKING</div>
    </div>
  );
}

function StatsBlock({ isMobile }) {
  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: isMobile ? '1.5rem' : '1rem' }}>
      {[['TEAMS','OPEN'],['PRIZE POOL','₹40K'],['HOURS','24']].map(([label, value]) => (
        <div key={label} style={{ borderBottom: isMobile ? 'none' : '1px solid #E10600', borderRight: isMobile ? '1px solid #E10600' : 'none', paddingBottom: isMobile ? 0 : '0.5rem', paddingRight: isMobile ? '1.5rem' : 0 }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: isMobile ? '0.5rem' : '0.6rem', letterSpacing: '0.3em', color: '#A0A0A0' }}>
            {label}
          </div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: isMobile ? '1.2rem' : '1.7rem', fontWeight: 700, color: '#E5E5E5', lineHeight: 1, marginTop: 4 }}>
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BreachExperience({ scrollYProgress }) {
  /* Only phase changes trigger React re-renders — NOT every scroll pixel */
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [showScroll, setShowScroll] = useState(true);
  const [glitch, setGlitch]         = useState(false);
  const [isMobile, setIsMobile]     = useState(false);

  /* DOM refs for zero-React-state updates */
  const progressBarRef = useRef(null);
  const prevPhaseRef   = useRef(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!scrollYProgress) return;
    const unsub = scrollYProgress.on('change', (v) => {
      /* Progress bar — direct DOM, no setState */
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${v * 100}%`;
      }

      /* Scroll hint — only needs to change once */
      if (v > 0.04 && showScroll) setShowScroll(false);

      /* Phase — only re-render when phase actually changes */
      const p = getPhaseIndex(v);
      if (p !== prevPhaseRef.current) {
        prevPhaseRef.current = p;
        if (p === 3) {
          setGlitch(true);
          setTimeout(() => setGlitch(false), 180);
        }
        setPhaseIndex(p);
      }
    });
    return unsub;
  }, [scrollYProgress, showScroll]);

  const phase = PHASES[phaseIndex];

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
      <style>{`
        @keyframes hud-blink  { 0%,49%{opacity:1}50%,100%{opacity:0} }
        @keyframes radar-sweep{ from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        @keyframes scrl-pulse { 0%,100%{opacity:0.4;transform:scaleY(0.7)}50%{opacity:1;transform:scaleY(1)} }
      `}</style>

      {/* Glitch flash — CSS transition only */}
      <div style={{
        position: 'absolute', inset: 0, background: '#E10600', zIndex: 50,
        pointerEvents: 'none', mixBlendMode: 'screen',
        opacity: glitch ? 0.2 : 0, transition: 'opacity 0.08s ease',
      }} />

      {/* Progress bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#1a1a1a', zIndex: 20 }}>
        <div ref={progressBarRef} style={{
          height: '100%', background: '#E10600', width: '0%',
          boxShadow: '0 0 6px #E10600',
          /* NO transition — raw scroll, no easing delay */
        }} />
      </div>

      {/* Top-left brand */}
      <div style={{ position: 'absolute', top: isMobile ? 10 : 20, left: isMobile ? 12 : 20, display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10 }}>
        <div style={{
          border: '1px solid #E10600', padding: isMobile ? '2px 5px' : '4px 8px',
          fontFamily: '"JetBrains Mono", monospace', fontSize: isMobile ? '0.55rem' : '0.7rem', color: '#E10600', letterSpacing: '0.2em',
        }}>U</div>
        <span style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: isMobile ? '0.45rem' : '0.6rem',
          letterSpacing: '0.22em', color: '#A0A0A0', textTransform: 'uppercase',
        }}>{isMobile ? 'SMACKATHON 2K26' : 'UPSURGE / SMACKATHON 2K26'}</span>
      </div>

      {/* Top-right phase dots */}
      <div style={{ position: 'absolute', top: isMobile ? 14 : 24, right: isMobile ? 12 : 20 }}>
        <PhaseDots active={phaseIndex} />
      </div>

      {/* Bottom-right credit — pushed above mobile navbar safe area */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? 72 : 20,
        left: isMobile ? '50%' : 'auto',
        right: isMobile ? 'auto' : 20,
        transform: isMobile ? 'translateX(-50%)' : 'none',
        fontFamily: '"JetBrains Mono", monospace', fontSize: isMobile ? '0.48rem' : '0.58rem',
        letterSpacing: '0.18em', color: '#A0A0A0', textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        CSE DEPARTMENT · YCCE, NAGPUR
      </div>

      {/* Phase content */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={phase.id}
            variants={phaseVariants}
            initial="enter"
            animate="visible"
            exit="exit"
            style={{
              position: 'absolute', inset: 0,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'flex-end',
              justifyContent: isMobile ? 'flex-end' : 'flex-start',
              padding: isMobile ? '0 16px 120px 16px' : '0 40px 88px 40px',
              boxSizing: 'border-box',
            }}
          >
            {/* Left */}
            <div style={{ flex: isMobile ? 'none' : 1, width: '100%', maxWidth: isMobile ? '100%' : 500 }}>
              <motion.div variants={childVariants} style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                <BlinkDot />
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.62rem', letterSpacing: '0.28em',
                  color: '#E10600', textTransform: 'uppercase',
                }}>{phase.label}</span>
              </motion.div>

              <motion.div variants={childVariants} style={{
                width: 44, height: 1, background: '#E10600',
                marginBottom: 10, boxShadow: '0 0 5px #E10600',
              }} />

              {phase.title && (
                <motion.div variants={childVariants} className="my-2">
                  <FuzzyText
                    fontSize="clamp(1.3rem, 5vw, 3.2rem)"
                    fontWeight={900}
                    color="#E5E5E5"
                    baseIntensity={0.15}
                    hoverIntensity={0.5}
                    fuzzRange={25}
                    glitchMode={true}
                    glitchInterval={3000}
                  >
                    {phase.title}
                  </FuzzyText>
                </motion.div>
              )}

              {phase.subtitle && (
                <motion.p variants={childVariants} style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.75rem', letterSpacing: '0.28em',
                  color: '#E10600', textTransform: 'uppercase', marginTop: 8,
                }}>{phase.subtitle}</motion.p>
              )}

              {(phaseIndex === 0 || phaseIndex === 3) && (
                <motion.div variants={childVariants} style={{
                  display: 'flex', gap: 12, marginTop: 22, pointerEvents: 'auto',
                }}>
                  <a
                    href="#problem-statements"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("problem-statements")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    style={{
                      background: 'transparent', color: '#E5E5E5',
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 600, fontSize: '0.72rem',
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      padding: '9px 18px', textDecoration: 'none',
                      border: '1px solid #E5E5E5', display: 'inline-block',
                      cursor: 'pointer',
                    }}
                  >VIEW TRACKS</a>
                </motion.div>
              )}
            </div>

            {/* Right — phase-specific */}
            {!isMobile && (
              <div style={{
                flex: 1,
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: 16
              }}>
                {phaseIndex === 1 && <ClassifiedStamp isMobile={false} />}
                {phaseIndex === 2 && <RadarSweep isMobile={false} />}
                {phaseIndex === 3 && <StatsBlock isMobile={false} />}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scroll hint — hidden on mobile to avoid navbar overlap */}
      {!isMobile && (
        <AnimatePresence>
          {showScroll && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              style={{
                position: 'absolute', bottom: 38, left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}
            >
              <div style={{
                width: 1, height: 36,
                background: 'linear-gradient(to bottom, #E10600, transparent)',
                animation: 'scrl-pulse 1.4s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: '0.58rem',
                letterSpacing: '0.28em', color: '#E10600', textTransform: 'uppercase',
              }}>SCROLL TO DECRYPT</span>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
