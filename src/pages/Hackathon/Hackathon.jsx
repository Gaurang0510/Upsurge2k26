import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import RedactedText from '../../components/common/RedactedText.jsx';
import TrackCard from '../../components/hackathon/TrackCard.jsx';
import { flagshipEvent } from '../../data/events/index.js';

export default function Hackathon() {
  useDocumentTitle(flagshipEvent.name);
  const event = flagshipEvent;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5 bg-ink">
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <span className="case-tag mx-auto">{event.caseNumber} — {event.format}</span>
          <h1 className="heading-display mt-4 text-6xl sm:text-8xl">{event.name}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-steel">{event.tagline}</p>
          <div className="mt-10 flex justify-center gap-4">
            <a href={event.registrationLink} className="btn-primary">
              Register Now
            </a>
            <a href="#tracks" className="btn-secondary">
              View Tracks
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Briefing" title="What is Operation Breach?" />
        <div className="mt-6">
          <RedactedText as="p" className="text-lg leading-relaxed text-paper/90">
            {event.description}
          </RedactedText>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {event.highlights.map((item) => (
            <li key={item} className="file-card flex gap-3 p-4 text-sm text-paper/90">
              <div className="noise-overlay" />
              <span className="relative text-evidence">›</span>
              <span className="relative">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Prize pool */}
      <section className="border-y border-white/5 bg-ink">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Stakes" title="Prize Pool" align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <PrizeCard place="🥇 1st Place" label="Ultimate Winner" amount={event.prize.first} currency={event.prize.currency} />
            <PrizeCard place="🥈 2nd Place" label="Runner-Up" amount={event.prize.second} currency={event.prize.currency} />
            <PrizeCard place="🥉 3rd Place" label="2nd Runner-Up" amount={event.prize.third} currency={event.prize.currency} />
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section id="tracks" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Seven Case Files"
          title="Tracks"
          description="Pick a track, or bring your own open case. Every submission is judged the same way regardless of track."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {event.tracks.map((track) => (
            <TrackCard key={track.code} track={track} />
          ))}
        </div>
      </section>

      {/* Assessment criteria */}
      <section className="border-y border-white/5 bg-ink">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Judging" title="Assessment Criteria" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {event.assessmentCriteria.map((criterion) => (
              <div key={criterion.title} className="file-card p-5">
                <div className="noise-overlay" />
                <p className="relative font-display text-xl text-paper">{criterion.title}</p>
                <p className="relative mt-2 text-sm text-steel">{criterion.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Debrief" title="Frequently Asked Questions" />
        <div className="mt-8 space-y-4">
          {event.faqs.map((faq) => (
            <details key={faq.q} className="file-card group p-5">
              <div className="noise-overlay" />
              <summary className="relative cursor-pointer font-display text-lg text-paper marker:content-none">
                {faq.q}
              </summary>
              <p className="relative mt-3 text-sm text-steel">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Venue */}
      <section className="border-t border-white/5 bg-ink">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Locate Us" title={event.venue} align="center" />
        </div>
      </section>
    </div>
  );
}

function PrizeCard({ place, label, amount, currency }) {
  return (
    <div className="file-card p-6">
      <div className="noise-overlay" />
      <p className="relative font-display text-2xl text-paper">{place}</p>
      <p className="relative mt-2 font-mono text-3xl font-bold text-evidence">
        {currency}
        {amount}
      </p>
      <p className="relative mt-1 text-xs uppercase tracking-widest text-steel">{label}</p>
    </div>
  );
}
