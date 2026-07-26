import { useRef, useState, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Award, ShieldAlert, Gift } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import TrackCard from '../../components/hackathon/TrackCard.jsx';
import TrackDetailModal from '../../components/hackathon/TrackDetailModal.jsx';
import HackerScrollCanvas from '../../components/hackathon/HackerScrollCanvas.jsx';
import BreachExperience from '../../components/hackathon/BreachExperience.jsx';
import ScrollFade, { ScrollStaggerContainer, ScrollStaggerItem } from '../../components/common/ScrollFade.jsx';
import FuzzyText from '../../components/FuzzyText.jsx';
import JudgedOptionWheel from '../../components/hackathon/JudgedOptionWheel.jsx';
import RulesSection from '../../components/hackathon/RulesSection.jsx';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import RadialOrbitalTimelineDemo from '../../components/ui/radial-orbital-demo.jsx';
import { flagshipEvent } from '../../data/events/index.js';
import './hackathon.css';

const summaryCards = [
  {
    label: 'Format',
    value: flagshipEvent.format,
    note: 'A guided multi-stage experience, from first idea to final demo.',
  },
  {
    label: 'Location',
    value: flagshipEvent.venue,
    note: 'The main campus rounds happen at YCCE, with support for shortlisted teams.',
  },
  {
    label: 'Registration',
    value: flagshipEvent.registrationLink === '#' ? 'Opening Soon' : 'Live Now',
    note: 'Round 0 is free. Shortlisted teams complete the next step after selection.',
  },
];

const stageTimeline = [
  {
    step: '01',
    title: 'Submit your idea',
    detail: 'Start with your concept deck and clearly show the problem, approach, and value.',
  },
  {
    step: '02',
    title: 'Build the prototype',
    detail: 'Shortlisted teams move into development with mentoring, iteration, and review.',
  },
  {
    step: '03',
    title: 'Present the final product',
    detail: 'The best teams showcase their finished solution in the closing round.',
  },
];

function AnimatedCounter({ value, duration = 1500, formatter = (v) => v }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp = null;
    const endValue = value;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress * (2 - progress); // easeOutQuad
      setCount(Math.floor(easeProgress * endValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, value, duration]);

  return <span ref={elementRef}>{formatter(count)}</span>;
}

export default function Hackathon() {
  useDocumentTitle(flagshipEvent.name);
  const event = flagshipEvent;
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDomain, setActiveDomain] = useState('All');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Master scroll — 600vh sticky container ── */
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div className="hackathon-page" style={{ background: '#0A0A0B' }}>

      {/* ═══════════════════════════════════════
          HERO — Scroll-Sequence (600vh sticky)
      ═══════════════════════════════════════ */}
      <section
        ref={containerRef}
        style={{ height: isMobile ? '350vh' : '600vh', position: 'relative' }}
      >
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          background: '#0A0A0B',
          willChange: 'transform',   /* GPU compositor layer — no paint on scroll */
          transform: 'translateZ(0)',
        }}>
          {/* Layer 0 — Scroll-scrubbed hacker image canvas */}
          <HackerScrollCanvas scrollYProgress={scrollYProgress} />

          {/* Layer 1 — Scanline CRT texture */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            pointerEvents: 'none',
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 4px)',
          }} />

          {/* Layer 2 — Top/bottom gradient vignette for text contrast */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 6,
            pointerEvents: 'none',
            background:
              'linear-gradient(to bottom, rgba(10,10,11,0.7) 0%, transparent 20%, transparent 72%, rgba(10,10,11,0.9) 100%)',
          }} />

          {/* Layer 3 — HUD overlay */}
          <BreachExperience scrollYProgress={scrollYProgress} />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          REST OF PAGE — GitHub main branch layout
      ═══════════════════════════════════════ */}
      <div className="hackathon-content-wrap relative z-10" style={{ position: 'relative', zIndex: 20, background: '#0A0A0B' }}>
        <section className="mx-auto max-w-7xl px-4 py-28 sm:py-36 sm:px-6 lg:px-8">
          <ScrollFade direction="up" className="mb-16 sm:mb-20">
            <div className="hackathon-panel">
              <span className="case-tag mb-3 inline-block">{"//"} Flagship Build Challenge</span>
              <div className="my-2">
                <FuzzyText
                  fontSize="clamp(1.4rem, 6vw, 4.5rem)"
                  fontWeight={900}
                  color="#E5E5E5"
                  baseIntensity={0.18}
                  hoverIntensity={0.5}
                  fuzzRange={28}
                  glitchMode={true}
                  glitchInterval={2500}
                >
                  Smackathon 2K26
                </FuzzyText>
              </div>
              <p className="text-steel text-base sm:text-lg mt-3 max-w-2xl">
                Smackathon is the flagship build challenge of UPSURGE 2K26, designed for teams who want to turn a strong idea into a working product and present it on a bigger stage.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to={event.registrationLink} className="btn-primary">
                  Register
                </Link>
                <a
                  href="#problem-statements"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("problem-statements")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="btn-secondary"
                >
                  View Problem Statements
                </a>
              </div>
            </div>
          </ScrollFade>

          {/* Overview Section with Container Scroll Animation */}
          <div className="mt-12">
            <ContainerScroll
              titleComponent={
                <div className="flex flex-col items-center pt-6 pb-6">
                  <span className="case-tag mb-6 sm:mb-8 inline-block">{"//"} Case Overview</span>
                  <h2 className="text-3xl sm:text-5xl font-semibold text-paper mt-2">
                    Unleash the power of <br />
                    <span className="text-4xl md:text-[5.5rem] font-bold mt-4 block leading-none text-red-500 uppercase tracking-wider">
                      Smackathon 2K26
                    </span>
                  </h2>
                </div>
              }
            >
              <img
                src="/images/gallery/smackathon-details-scroll.png"
                alt="Smackathon Details"
                className="mx-auto rounded-2xl object-contain h-full w-full bg-black"
                draggable={false}
              />
            </ContainerScroll>
          </div>

          <ScrollStaggerContainer className="mt-12 grid gap-6 sm:grid-cols-3">
            {summaryCards.map((card) => (
              <ScrollStaggerItem key={card.label} direction="up" className="hackathon-dossier-card">
                <span className="hackathon-dossier-label">{card.label}</span>
                <h3 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper">
                  {card.value}
                </h3>
                <p className="mt-3 text-sm leading-7 text-steel">{card.note}</p>
              </ScrollStaggerItem>
            ))}
          </ScrollStaggerContainer>
        </section>

        {/* ═══════════════════════════════════════
            PRIZE POOL SECTION (Cyber Forensic)
        ═══════════════════════════════════════ */}
        <section className="border-b border-white/5 bg-transparent relative overflow-hidden">
          {/* Ambient decorative glowing orbs for the prize pool section */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-950/20 blur-[120px] rounded-full pointer-events-none z-0" />
          
          <div className="mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8 relative z-10">
            
            {/* High Fidelity Prize Pool Header matching Squid Game layout style but Cyber Themed */}
            <ScrollFade direction="up" className="flex flex-col items-center text-center mb-20">
              <span className="font-mono text-xs text-red-500 tracking-[0.4em] uppercase mb-3 block">
                {"//"} DECRYPTED BOUNTY SEIZURE
              </span>
              <h2 className="font-display text-4xl sm:text-7xl uppercase tracking-wider text-red-600 font-extrabold drop-shadow-[0_0_15px_rgba(239,68,68,0.25)]">
                PRIZE POOL
              </h2>
              <div className="mt-4 text-5xl sm:text-8xl font-black font-mono tracking-tight text-white flex items-center justify-center gap-1 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <span className="text-red-500 font-extrabold select-none">₹</span>
                <AnimatedCounter value={40000} duration={2000} formatter={(v) => v.toLocaleString('en-IN')} />
              </div>
              <p className="mt-6 font-mono text-[10px] sm:text-xs text-zinc-400 max-w-2xl uppercase tracking-widest leading-relaxed">
                Victory comes at a price. But for the digital investigators who resolve the breach — the bounty is everything.
              </p>
            </ScrollFade>

            <div className="mt-16 max-w-6xl mx-auto flex flex-col gap-8 md:gap-12">
              {/* Podium Grid for Cash Prizes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-stretch">
                
                {/* Card 2: 2nd Place (1st Runner Up) - Placed Left on Desktop */}
                <ScrollFade direction="up" delay={0.2} className="cyber-prize-card silver-tier p-6 flex flex-col justify-between min-h-[320px] order-2 md:order-1 md:translate-y-4 self-stretch">
                  <div className="prize-card-grid-overlay" />
                  <div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                      <span className="font-mono text-[9px] tracking-widest uppercase text-sky-400 font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                        SEC_INTEL_RECOVERED
                      </span>
                      <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">LEVEL_3</span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="prize-icon-wrapper text-sky-400">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-400">2ND PLACE</span>
                        <h4 className="font-display text-lg uppercase tracking-wide text-white">1ST RUNNER UP</h4>
                      </div>
                    </div>
                    <div className="my-4">
                      <span className="font-mono text-3xl font-extrabold text-sky-400 tracking-tight flex items-center gap-1">
                        <span>₹</span>
                        <AnimatedCounter value={10000} duration={1800} formatter={(v) => v.toLocaleString('en-IN')} />
                      </span>
                      <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase block mt-1">CASH BOUNTY</span>
                    </div>
                  </div>
                  <div className="border-t border-white/5 pt-4 mt-6">
                    <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                      Senior forensic specialist. Pinpoints zero-day exploits, traces adversarial footprints, and executes file recovery.
                    </p>
                    <div className="flex justify-between items-center font-mono text-[9px] text-zinc-500">
                      <span>ACCESS: ADMIN_SYS</span>
                      <span>SEC_STATUS: CLEAR</span>
                    </div>
                  </div>
                </ScrollFade>

                {/* Card 1: 1st Place (Winner) - Placed Center & Elevated on Desktop */}
                <ScrollFade direction="up" delay={0.1} className="cyber-prize-card gold-tier p-6 flex flex-col justify-between min-h-[340px] order-1 md:order-2 md:-translate-y-4 md:scale-105 border-yellow-500/30 hover:border-yellow-500/80 shadow-[0_0_40px_rgba(234,179,8,0.06)] self-stretch z-10">
                  <div className="prize-card-grid-overlay" />
                  <div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                      <span className="font-mono text-[9px] tracking-widest uppercase text-yellow-500 font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                        CRITICAL_BREACH_SOLVED
                      </span>
                      <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">SYS_SEIZED</span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="prize-icon-wrapper text-yellow-500">
                        <Trophy className="w-7 h-7 animate-bounce" style={{ animationDuration: '3s' }} />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] tracking-widest uppercase text-yellow-500 font-bold">★ ULTIMATE WINNER ★</span>
                        <h4 className="font-display text-xl uppercase tracking-wide text-white mt-0.5">CHAMPION</h4>
                      </div>
                    </div>
                    <div className="my-5">
                      <span className="font-mono text-4xl font-extrabold text-yellow-500 tracking-tight flex items-center gap-1">
                        <span>₹</span>
                        <AnimatedCounter value={20000} duration={2000} formatter={(v) => v.toLocaleString('en-IN')} />
                      </span>
                      <span className="font-mono text-[9px] text-zinc-400 tracking-widest uppercase block mt-1">CASH BOUNTY</span>
                    </div>
                  </div>
                  <div className="border-t border-white/5 pt-4 mt-6">
                    <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                      Ultimate threat investigator. Leads case resolution, decrypts main server flags, and secures system networks.
                    </p>
                    <div className="flex justify-between items-center font-mono text-[9px] text-zinc-400">
                      <span>ACCESS: ROOT_SHELL</span>
                      <span>SEC_STATUS: COMPROMISED</span>
                    </div>
                  </div>
                </ScrollFade>

                {/* Card 3: 3rd Place (2nd Runner Up) - Placed Right on Desktop */}
                <ScrollFade direction="up" delay={0.3} className="cyber-prize-card bronze-tier p-6 flex flex-col justify-between min-h-[320px] order-3 md:order-3 md:translate-y-8 self-stretch">
                  <div className="prize-card-grid-overlay" />
                  <div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                      <span className="font-mono text-[9px] tracking-widest uppercase text-orange-400 font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                        PERIMETER_SECURED
                      </span>
                      <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">LEVEL_2</span>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="prize-icon-wrapper text-orange-400">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-400">3RD PLACE</span>
                        <h4 className="font-display text-lg uppercase tracking-wide text-white">2ND RUNNER UP</h4>
                      </div>
                    </div>
                    <div className="my-4">
                      <span className="font-mono text-3xl font-extrabold text-orange-400 tracking-tight flex items-center gap-1">
                        <span>₹</span>
                        <AnimatedCounter value={5000} duration={1800} formatter={(v) => v.toLocaleString('en-IN')} />
                      </span>
                      <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase block mt-1">CASH BOUNTY</span>
                    </div>
                  </div>
                  <div className="border-t border-white/5 pt-4 mt-6">
                    <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                      Incident responder. Isolates corrupted nodes, builds secure threat mitigations, and monitors anomalous network data.
                    </p>
                    <div className="flex justify-between items-center font-mono text-[9px] text-zinc-500">
                      <span>ACCESS: SECURE_DEV</span>
                      <span>SEC_STATUS: CLEAR</span>
                    </div>
                  </div>
                </ScrollFade>

              </div>

              {/* Horizontal Wide Card for Swags and Goodies */}
              <ScrollFade direction="up" delay={0.4} className="cyber-prize-card goodies-tier p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-12 min-h-[140px] mt-4 md:mt-8">
                <div className="prize-card-grid-overlay" />
                <div className="flex-1">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <span className="font-mono text-[9px] tracking-widest uppercase text-purple-400 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      TACTICAL_SUPPLY_DROP
                    </span>
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">PROVISIONED</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="prize-icon-wrapper text-purple-400 flex-shrink-0">
                      <Gift className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-400">ADDITIONAL BOUNTY</span>
                      <h4 className="font-display text-lg uppercase tracking-wide text-white">CYBER GEAR & SWAG</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed mt-1.5 max-w-xl">
                        Cyber tactical gear, official Upsurge merch, custom swags, and developer sticker packs distributed to teams.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-px bg-white/5 self-stretch hidden md:block" />

                <div className="flex flex-col justify-center items-end text-right flex-shrink-0">
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-3xl md:text-4xl font-extrabold text-purple-400">₹</span>
                    <span className="font-mono text-4xl md:text-5xl font-black text-purple-400">
                      <AnimatedCounter value={5000} duration={1800} formatter={(v) => v.toLocaleString('en-IN')} />
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase mt-1">WORTH OF GOODIES</span>
                </div>
              </ScrollFade>

            </div>

            <div className="mt-16 flex flex-col items-center justify-center border-t border-white/5 pt-8 text-center">
              <p className="font-mono text-xs text-zinc-400 max-w-xl">
                Every action leaves a digital footprint. Analyze the evidence, recover the compromised logs, and claim your bounty reward.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-6 font-mono text-[10px] tracking-widest text-red-500 uppercase font-bold">
                <span>[ CASH_PRIZES ]</span>
                <span>[ OFFICIAL_CERTIFICATES ]</span>
                <span>[ CYBER_SWAG_GEAR ]</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-transparent">
          <div className="mx-auto max-w-7xl px-4 py-28 sm:py-36 sm:px-6 lg:px-8">
            <ScrollFade direction="up">
              <SectionHeading
                eyebrow="Process"
                title="How The Hackathon Flows"
                description="A simple three-step structure that takes teams from idea to final presentation."
                scrollFloat={true}
              />
            </ScrollFade>
            <ScrollStaggerContainer className="mt-16 grid gap-6 lg:grid-cols-3">
              {stageTimeline.map((item) => (
                <ScrollStaggerItem key={item.step} direction="up" className="hackathon-protocol-card">
                  <span className="hackathon-protocol-step">{item.step}</span>
                  <h3 className="mt-4 font-display text-3xl uppercase tracking-wide text-paper">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-steel">{item.detail}</p>
                </ScrollStaggerItem>
              ))}
            </ScrollStaggerContainer>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:py-28 sm:px-6 lg:px-8" id="problem-statements">
          <ScrollFade direction="up">
            <SectionHeading
              eyebrow="Domain Tracks"
              title="Interactive Orbital Domain Explorer"
              description="Explore the 8 core innovation domains for Smackathon 2K26. Click on any domain node to inspect connected case tracks and activity telemetry."
              scrollFloat={true}
            />
          </ScrollFade>

          {/* Radial Orbital Domain Explorer */}
          <RadialOrbitalTimelineDemo />

          <ScrollFade direction="up" className="mt-24">
            <SectionHeading
              eyebrow="Problem Statements"
              title="Choose The Problem Space"
              description="Pick the area that matches your interest, skill set, and the kind of solution you want to build."
              scrollFloat={true}
            />
          </ScrollFade>

          {/* Domain Filter Tab Bar */}
          <ScrollFade direction="up" className="mt-12 flex flex-col items-center">
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl">
              {['All', ...new Set(event.tracks.map(t => t.domain))].map((domain) => (
                <button
                  key={domain}
                  onClick={() => setActiveDomain(domain)}
                  className={`font-mono text-[10px] sm:text-xs uppercase px-4 py-2 border transition-all duration-300 relative tracking-wider ${
                    activeDomain === domain
                      ? 'bg-red-950/40 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)] font-bold'
                      : 'bg-black/40 border-white/10 text-zinc-500 hover:border-red-500/40 hover:text-zinc-300'
                  }`}
                >
                  {activeDomain === domain && (
                    <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-2 animate-pulse" />
                  )}
                  {domain}
                </button>
              ))}
            </div>
            
            {/* Matches counter metadata */}
            <div className="mt-6 font-mono text-[9px] tracking-widest text-zinc-500 uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              STATUS: SECURE_LINK // CASES_RESOLVED: {
                activeDomain === 'All' 
                  ? event.tracks.length 
                  : event.tracks.filter(t => t.domain === activeDomain).length
              } FILES FOUND
            </div>
          </ScrollFade>

          <ScrollStaggerContainer key={activeDomain} className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 w-full max-w-full">
            {event.tracks
              .filter(track => activeDomain === 'All' || track.domain === activeDomain)
              .map((track) => (
                <ScrollStaggerItem key={track.code} direction="up">
                  <TrackCard track={track} onAccess={(track) => setSelectedTrack(track)} />
                </ScrollStaggerItem>
              ))}
          </ScrollStaggerContainer>

          {selectedTrack && (
            <TrackDetailModal track={selectedTrack} onClose={() => setSelectedTrack(null)} />
          )}
        </section>

        <section className="border-y border-white/5 bg-transparent">
          <JudgedOptionWheel criteria={event.assessmentCriteria} />
        </section>

        <section className="mx-auto max-w-7xl px-4 py-28 sm:py-36 sm:px-6 lg:px-8">
          <RulesSection rules={event.rules} />
        </section>

        <section className="border-t border-white/5 bg-transparent">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8">
            <ScrollFade direction="scale" className="hackathon-command-card">
              <div>
                <span className="case-tag">Venue</span>
                <h2 className="heading-display mt-4 text-4xl sm:text-5xl">{event.venue}</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-paper/80">
                  Smackathon brings teams together in a focused build environment where strong ideas can
                  turn into finished demos, feedback, and real momentum.
                </p>
              </div>
              <Link to={event.registrationLink} className="btn-primary">
                Join Smackathon
              </Link>
            </ScrollFade>
          </div>
        </section>
      </div>
    </div>
  );
}
