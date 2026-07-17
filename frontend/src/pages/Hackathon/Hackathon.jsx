import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import RedactedText from '../../components/common/RedactedText.jsx';
import TrackCard from '../../components/hackathon/TrackCard.jsx';
import Balatro from '../../components/Balatro.jsx';
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

  const handleHeroPointerMove = (pointerEvent) => {
    const bounds = pointerEvent.currentTarget.getBoundingClientRect();
    const x = ((pointerEvent.clientX - bounds.left) / bounds.width) * 100;
    const y = ((pointerEvent.clientY - bounds.top) / bounds.height) * 100;

    pointerEvent.currentTarget.style.setProperty('--pointer-x', `${x}%`);
    pointerEvent.currentTarget.style.setProperty('--pointer-y', `${y}%`);
  };

  const resetHeroPointer = (pointerEvent) => {
    pointerEvent.currentTarget.style.setProperty('--pointer-x', '50%');
    pointerEvent.currentTarget.style.setProperty('--pointer-y', '50%');
  };

  return (
    <div className="hackathon-page">
      <section
        className="hackathon-hero relative overflow-hidden flex flex-col items-center justify-center text-center"
        onMouseMove={handleHeroPointerMove}
        onMouseLeave={resetHeroPointer}
      >
        {/* React Bits Balatro Shader Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
          <Balatro
            color1="#C1121F"
            color2="#780000"
            color3="#050505"
            spinSpeed={5.0}
            contrast={3.0}
            lighting={0.3}
          />
        </div>
        {/* Submerge/fade effect at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-case-black to-transparent pointer-events-none z-10" />
        <div className="hackathon-grid-glow" aria-hidden="true" />
        <div className="hackathon-grid-lines" aria-hidden="true" />
        <div className="hackathon-hero-spotlight" aria-hidden="true" />
        <div className="hackathon-hero-ring hackathon-hero-ring-one" aria-hidden="true" />
        <div className="hackathon-hero-ring hackathon-hero-ring-two" aria-hidden="true" />
        <div className="hackathon-hero-beam hackathon-hero-beam-one" aria-hidden="true" />
        <div className="hackathon-hero-beam hackathon-hero-beam-two" aria-hidden="true" />
        <div className="hackathon-hero-noise" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="hackathon-kicker mx-auto mb-10">
            <span>{event.caseNumber}</span>
          </div>

          <div className="hackathon-wordmark-wrap" aria-label="Smackathon">
            <span className="hackathon-wordmark-backdrop">SMACKATHON</span>
            <h1 className="hackathon-wordmark">SMACKATHON</h1>
          </div>

          <p className="hackathon-year-mark mt-4">2K26</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="hackathon-panel">
            <SectionHeading
              eyebrow="Flagship Build Challenge"
              title="Smackathon 2K26"
              description="Smackathon is the flagship build challenge of UPSURGE 2K26, designed for teams who want to turn a strong idea into a working product and present it on a bigger stage."
            />
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={event.registrationLink} className="btn-primary">
                Register
              </a>
              <a href="#tracks" className="btn-secondary">
                View Tracks
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="hackathon-panel">
            <SectionHeading eyebrow="Overview" title="What Smackathon Is About" />
            <div className="mt-6">
              <RedactedText as="p" className="text-lg leading-8 text-paper/90">
                {event.description}
              </RedactedText>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {event.highlights.map((item) => (
                <div key={item} className="hackathon-evidence-card">
                  <span className="hackathon-evidence-index">Highlight</span>
                  <p className="mt-3 text-sm leading-7 text-paper/85">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {summaryCards.map((card) => (
              <div key={card.label} className="hackathon-dossier-card">
                <span className="hackathon-dossier-label">{card.label}</span>
                <h3 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper">
                  {card.value}
                </h3>
                <p className="mt-3 text-sm leading-7 text-steel">{card.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-ink/70">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Process"
            title="How The Hackathon Flows"
            description="A simple three-step structure that takes teams from idea to final presentation."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {stageTimeline.map((item) => (
              <div key={item.step} className="hackathon-protocol-card">
                <span className="hackathon-protocol-step">{item.step}</span>
                <h3 className="mt-4 font-display text-3xl uppercase tracking-wide text-paper">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-steel">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" id="tracks">
        <SectionHeading
          eyebrow="Tracks"
          title="Choose The Problem Space"
          description="Pick the area that matches your interest, skill set, and the kind of solution you want to build."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {event.tracks.map((track) => (
            <TrackCard key={track.code} track={track} />
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-ink/70">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Evaluation" title="How Teams Are Judged" align="center" />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {event.assessmentCriteria.map((criterion, index) => (
                <div key={criterion.title} className="hackathon-score-card">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-display text-2xl uppercase tracking-wide text-paper">{criterion.title}</p>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-evidence">
                    0{index + 1}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-steel">{criterion.detail}</p>
                <div className="hackathon-score-bar mt-5">
                  <span style={{ width: `${78 + index * 2.5}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="hackathon-panel w-full">
          <SectionHeading eyebrow="Rules" title="Participation Guidelines" />
          <div className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-2">
            {event.rules.map((rule, index) => (
              <div key={rule} className="hackathon-rule-card">
                <span className="hackathon-rule-index">0{index + 1}</span>
                <p className="text-sm leading-7 text-paper/85">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="hackathon-command-card">
            <div>
              <span className="case-tag">Venue</span>
              <h2 className="heading-display mt-4 text-4xl sm:text-5xl">{event.venue}</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-paper/80">
                Smackathon brings teams together in a focused build environment where strong ideas can
                turn into finished demos, feedback, and real momentum.
              </p>
            </div>
            <a href={event.registrationLink} className="btn-primary">
              Join Smackathon
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
