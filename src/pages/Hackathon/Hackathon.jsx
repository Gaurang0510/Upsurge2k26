import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import RedactedText from '../../components/common/RedactedText.jsx';
import TrackCard from '../../components/hackathon/TrackCard.jsx';
import { flagshipEvent } from '../../data/events/index.js';
import './hackathon.css';

const protocolTimeline = [
  {
    step: '01',
    title: 'Initial Breach',
    detail: 'Opening briefing, team verification, and the first locked case file drop.',
  },
  {
    step: '02',
    title: 'Surveillance Window',
    detail: 'Mentor sweeps, live checkpoints, and strategic reroutes as ideas sharpen.',
  },
  {
    step: '03',
    title: 'Evidence Submission',
    detail: 'Final prototype handoff, demo staging, and judiciary review under the clock.',
  },
];

const heroSignals = [
  { label: 'Threat Level', value: 'Critical' },
  { label: 'Access Window', value: flagshipEvent.duration },
  { label: 'Crew Size', value: flagshipEvent.teamSize },
];

const dossierCards = [
  {
    label: 'Case Format',
    value: flagshipEvent.format,
    note: 'Built for late-night sprints, high-stakes demos, and sharp pivots.',
  },
  {
    label: 'Location',
    value: flagshipEvent.venue,
    note: 'The entire scene stays on campus, so every checkpoint is close to the action.',
  },
  {
    label: 'Registration',
    value: flagshipEvent.registrationLink === '#' ? 'Opening Soon' : 'Live Now',
    note: 'Reserve your slot before the grid fills up and the doors lock.',
  },
];

export default function Hackathon() {
  useDocumentTitle(flagshipEvent.name);
  const event = flagshipEvent;

  return (
    <div className="hackathon-page">
      <section className="hackathon-hero relative overflow-hidden border-b border-white/5">
        <div className="hackathon-grid-bg" aria-hidden="true" />
        <div className="hackathon-grid-glow" aria-hidden="true" />
        <div className="hackathon-scanline" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
          <div className="relative z-10">
            <div className="hackathon-alert-strip">
              <span>{event.caseNumber}</span>
              <span>Smackathon</span>
              <span>Cyber Crime Division</span>
              <span>24-Hour Lock-In</span>
            </div>
            <span className="case-tag mt-8">{event.caseNumber} // {event.format}</span>
            <h1 className="heading-display mt-5 max-w-4xl text-5xl sm:text-7xl lg:text-[6.5rem]">
              Smackathon:
              <span className="hackathon-title-glow block text-evidence">Operation Breach</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-paper/85 sm:text-xl">
              A full-scale cyber crime scenario built for coders, designers, and operators who want a
              hackathon page that feels like an active case file instead of a plain event listing.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {heroSignals.map((signal) => (
                <div key={signal.label} className="hackathon-signal-card">
                  <span className="hackathon-signal-label">{signal.label}</span>
                  <strong className="hackathon-signal-value">{signal.value}</strong>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href={event.registrationLink} className="btn-primary">
                Secure Entry
              </a>
              <a href="#tracks" className="btn-secondary">
                Inspect Tracks
              </a>
            </div>
            <div className="hackathon-terminal mt-10 max-w-2xl">
              <div className="hackathon-terminal-bar">
                <span className="hackathon-dot bg-breach" />
                <span className="hackathon-dot bg-evidence" />
                <span className="hackathon-dot bg-terminal" />
                <span className="ml-3 text-xs uppercase tracking-[0.3em] text-steel">live-briefing.log</span>
              </div>
              <div className="space-y-3 p-5 font-mono text-sm text-terminal">
                <p>&gt; incident_status: active</p>
                <p>&gt; mission_brief: {event.tagline}</p>
                <p>&gt; directive: build, test, pitch before sunrise</p>
                <p>&gt; mentor_channel: always online</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-center">
            <div className="hackathon-console">
              <div className="hackathon-console-ring hackathon-console-ring-one" />
              <div className="hackathon-console-ring hackathon-console-ring-two" />
              <div className="hackathon-console-ring hackathon-console-ring-three" />
              <div className="hackathon-console-core">
                <span className="hackathon-console-label">Threat Map</span>
                <div className="hackathon-console-matrix">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="hackathon-console-stack">
                  <div className="hackathon-console-chip">
                    <span className="text-steel">Focus</span>
                    <strong>UI / UX</strong>
                  </div>
                  <div className="hackathon-console-chip">
                    <span className="text-steel">Visual Tone</span>
                    <strong>Cyber Crime</strong>
                  </div>
                  <div className="hackathon-console-chip">
                    <span className="text-steel">Experience</span>
                    <strong>Immersive</strong>
                  </div>
                </div>
              </div>
              <div className="hackathon-console-footer">
                <span>Encrypted evidence stream</span>
                <span>3D surveillance grid</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="hackathon-panel">
            <SectionHeading eyebrow="Briefing" title="Inside The Case File" />
            <div className="mt-6">
              <RedactedText as="p" className="text-lg leading-8 text-paper/90">
                {event.description}
              </RedactedText>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {event.highlights.map((item) => (
                <div key={item} className="hackathon-evidence-card">
                  <span className="hackathon-evidence-index">Evidence</span>
                  <p className="mt-3 text-sm leading-7 text-paper/85">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {dossierCards.map((card) => (
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
            eyebrow="Protocol"
            title="How The Operation Unfolds"
            description="The route now reads like a live investigation board, with each phase treated like a tactical step in the breach."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {protocolTimeline.map((item) => (
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
          eyebrow="Seven Case Files"
          title="Tracks Under Surveillance"
          description="Every track is framed like its own cyber crime dossier, so the page feels consistent with the larger criminal-investigation theme."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {event.tracks.map((track) => (
            <TrackCard key={track.code} track={track} />
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-ink/70">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Judging Matrix" title="Assessment Criteria" align="center" />
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
                  <span style={{ width: `${78 + index * 5}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="hackathon-panel">
            <SectionHeading eyebrow="Rules Of Engagement" title="Operational Constraints" />
            <div className="mt-8 space-y-4">
              {event.rules.map((rule, index) => (
                <div key={rule} className="hackathon-rule-card">
                  <span className="hackathon-rule-index">0{index + 1}</span>
                  <p className="text-sm leading-7 text-paper/85">{rule}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hackathon-panel">
            <SectionHeading eyebrow="Debrief" title="Frequently Asked Questions" />
            <div className="mt-8 space-y-4">
              {event.faqs.map((faq) => (
                <details key={faq.q} className="hackathon-faq-card group">
                  <summary className="cursor-pointer list-none font-display text-xl uppercase tracking-wide text-paper">
                    {faq.q}
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-steel">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="hackathon-command-card">
            <div>
              <span className="case-tag">Command Center</span>
              <h2 className="heading-display mt-4 text-4xl sm:text-5xl">{event.venue}</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-paper/80">
                The hackathon route is now framed like a cyber crime control room, making the event feel sharper,
                darker, and much more memorable while staying limited to this page’s code path.
              </p>
            </div>
            <a href={event.registrationLink} className="btn-primary">
              Join The Operation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
