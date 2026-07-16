
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import RedactedText from '../../components/common/RedactedText.jsx';
import TrackCard from '../../components/hackathon/TrackCard.jsx';
import Smackathon3DLogo from '../../components/hackathon/Smackathon3DLogo.jsx';
import { flagshipEvent } from '../../data/events/index.js';
import './hackathon.css';

const protocolTimeline = [
  {
    step: '01',
    title: 'Idea Submission',
    detail: 'Round 0 (Online): Submit your PPT proposing a solution. Completely free.',
  },
  {
    step: '02',
    title: 'Prototype Development',
    detail: 'Round 1 (Offline/Online): Build a working prototype. Continuous mentoring and judging.',
  },
  {
    step: '03',
    title: 'Grand Finale',
    detail: 'Final demonstration, jury interaction, and evaluation. Top 3 teams selected.',
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
    note: 'Multi-stage structured process: Online Idea Submission to Offline Grand Finale.',
  },
  {
    label: 'Location',
    value: flagshipEvent.venue,
    note: 'Round 1 and Grand Finale conducted at host campus. Online slots available on-demand.',
  },
  {
    label: 'Registration',
    value: flagshipEvent.registrationLink === '#' ? 'Opening Soon' : 'Live Now',
    note: 'Register on Unstop. Free Round 0. Offline fee ₹599.',
  },
];

export default function Hackathon() {
  useDocumentTitle(flagshipEvent.name);
  const event = flagshipEvent;


  return (
    <div className="hackathon-page">
      <div className="ambient-orb ambient-orb-1" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-2" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-3" aria-hidden="true" />
      <section className="hackathon-hero relative overflow-hidden border-b border-white/5 flex flex-col items-center justify-center text-center">
        <div className="hackathon-grid-glow" aria-hidden="true" />
        
        {/* Subtle Background Radar */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none scale-[2] md:scale-[2.5] z-0 mix-blend-screen">
          <div className="cyber-core-container">
            <div className="cyber-core-ring cyber-outer-ring" />
            <div className="cyber-core-ring cyber-middle-ring" />
            <div className="cyber-core-ring cyber-inner-ring" />
            <div className="cyber-core-glow" />
            <div className="cyber-particles">
              <span className="particle p-1"></span>
              <span className="particle p-2"></span>
              <span className="particle p-3"></span>
              <span className="particle p-4"></span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-5xl mx-auto px-4 py-24 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center">
          <div className="hackathon-alert-strip mx-auto mb-8">
            <span>{event.caseNumber}</span>
            <span>Smackathon</span>
            <span>Cyber Crime Division</span>
            <span>24-Hour Lock-In</span>
          </div>

          <div className="relative mb-8 w-full max-w-2xl mx-auto flex justify-center">
            <Smackathon3DLogo />
          </div>

          <h2 className="heading-display mt-4 text-3xl sm:text-5xl text-white tracking-[0.15em] uppercase">
            OPERATION BREACH
          </h2>
          <p className="mt-4 text-evidence font-mono text-sm sm:text-base tracking-[0.25em] uppercase mb-10 text-shadow-glow">
            India's Premier Cyber Crime Hackathon
          </p>

          <p className="max-w-3xl text-lg md:text-xl leading-relaxed text-paper/85 mb-14">
            A full-scale cyber crime scenario built for coders, designers, and operators who want a
            hackathon page that feels like an active case file instead of a plain event listing.
          </p>

          <div className="grid gap-6 sm:grid-cols-3 w-full max-w-4xl mb-14">
            {heroSignals.map((signal) => (
              <div key={signal.label} className="hackathon-signal-card text-center flex flex-col items-center justify-center py-8 hover:bg-white/5 transition-colors duration-300">
                <span className="hackathon-signal-label">{signal.label}</span>
                <strong className="hackathon-signal-value mt-3">{signal.value}</strong>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href={event.registrationLink} className="btn-primary px-10 py-4 text-base">
              Secure Entry
            </a>
            <a href="#tracks" className="btn-secondary px-10 py-4 text-base">
              Inspect Tracks
            </a>
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
