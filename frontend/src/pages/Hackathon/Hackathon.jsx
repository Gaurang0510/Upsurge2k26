import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import RedactedText from '../../components/common/RedactedText.jsx';
import TrackCard from '../../components/hackathon/TrackCard.jsx';
import HackerScrollCanvas from '../../components/hackathon/HackerScrollCanvas.jsx';
import BreachExperience from '../../components/hackathon/BreachExperience.jsx';
import ScrollFade, { ScrollStaggerContainer, ScrollStaggerItem } from '../../components/common/ScrollFade.jsx';
import FuzzyText from '../../components/FuzzyText.jsx';
import JudgedOptionWheel from '../../components/hackathon/JudgedOptionWheel.jsx';
import RulesSection from '../../components/hackathon/RulesSection.jsx';
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

export default function Hackathon() {
  useDocumentTitle(flagshipEvent.name);
  const event = flagshipEvent;

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
        style={{ height: '600vh', position: 'relative' }}
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
              <span className="case-tag mb-3 inline-block">// Flagship Build Challenge</span>
              <div className="my-2">
                <FuzzyText
                  fontSize="clamp(2.2rem, 6vw, 4.5rem)"
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

          <div className="grid gap-12 lg:gap-16 lg:grid-cols-[1fr_0.95fr]">
            <ScrollFade direction="left" className="hackathon-panel">
              <SectionHeading eyebrow="Overview" title="What Smackathon Is About" scrollFloat={true} />
              <div className="mt-6">
                <RedactedText as="p" className="text-lg leading-8 text-paper/90">
                  {event.description}
                </RedactedText>
              </div>
              <ScrollStaggerContainer className="mt-8 grid gap-4 sm:grid-cols-2">
                {event.highlights.map((item) => (
                  <ScrollStaggerItem key={item} direction="up" className="hackathon-evidence-card">
                    <span className="hackathon-evidence-index">Highlight</span>
                    <p className="mt-3 text-sm leading-7 text-paper/85">{item}</p>
                  </ScrollStaggerItem>
                ))}
              </ScrollStaggerContainer>
            </ScrollFade>

            <ScrollStaggerContainer className="space-y-6">
              {summaryCards.map((card) => (
                <ScrollStaggerItem key={card.label} direction="right" className="hackathon-dossier-card">
                  <span className="hackathon-dossier-label">{card.label}</span>
                  <h3 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper">
                    {card.value}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-steel">{card.note}</p>
                </ScrollStaggerItem>
              ))}
            </ScrollStaggerContainer>
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

        <section className="mx-auto max-w-7xl px-4 py-28 sm:py-36 sm:px-6 lg:px-8" id="problem-statements">
          <ScrollFade direction="up">
            <SectionHeading
              eyebrow="Problem Statements"
              title="Choose The Problem Space"
              description="Pick the area that matches your interest, skill set, and the kind of solution you want to build."
              scrollFloat={true}
            />
          </ScrollFade>
          <ScrollStaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {event.tracks.map((track) => (
              <ScrollStaggerItem key={track.code} direction="up">
                <TrackCard track={track} />
              </ScrollStaggerItem>
            ))}
          </ScrollStaggerContainer>
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
