import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import Hero from '../../components/home/Hero.jsx';
import EventsPreview from '../../components/home/EventsPreview.jsx';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import RedactedText from '../../components/common/RedactedText.jsx';
import { flagshipEvent } from '../../data/events/index.js';
import { Link } from 'react-router-dom';

export default function Home() {
  useDocumentTitle('Home');

  return (
    <>
      <Hero />

      <EventsPreview />

      {/* Flagship spotlight */}
      <section className="border-y border-white/5 bg-ink">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              eyebrow={flagshipEvent.caseNumber}
              title={flagshipEvent.name}
              description={flagshipEvent.tagline}
            />
            <div className="mt-6 max-w-lg">
              <RedactedText as="p" className="text-steel">
                {flagshipEvent.description}
              </RedactedText>
            </div>
            <Link to="/hackathon" className="btn-danger mt-8 inline-flex">
              Open Full Case File
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 self-start">
            <div className="file-card p-5">
              <div className="noise-overlay" />
              <p className="relative font-mono text-xs uppercase tracking-widest text-steel">Format</p>
              <p className="relative mt-2 font-display text-2xl text-paper">{flagshipEvent.format}</p>
            </div>
            <div className="file-card p-5">
              <div className="noise-overlay" />
              <p className="relative font-mono text-xs uppercase tracking-widest text-steel">Team Size</p>
              <p className="relative mt-2 font-display text-2xl text-paper">{flagshipEvent.teamSize}</p>
            </div>
            <div className="file-card p-5 col-span-2">
              <div className="noise-overlay" />
              <p className="relative font-mono text-xs uppercase tracking-widest text-steel">Duration</p>
              <p className="relative mt-2 font-display text-2xl text-paper">{flagshipEvent.duration}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="case-tag mx-auto">Case Closes Soon</span>
        <h2 className="heading-display mt-4 text-4xl sm:text-6xl">Ready to go on record?</h2>
        <p className="mx-auto mt-4 max-w-xl text-steel">
          Registrations open shortly across all thirteen events. Check the schedule and pick your case.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/events" className="btn-primary">
            Browse Events
          </Link>
          <Link to="/schedule" className="btn-secondary">
            View Schedule
          </Link>
        </div>
      </section>
    </>
  );
}
