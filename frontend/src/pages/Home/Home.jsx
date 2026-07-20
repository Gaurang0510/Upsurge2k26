import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import Hero from '../../components/home/Hero.jsx';
import EventsPreview from '../../components/home/EventsPreview.jsx';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import RedactedText from '../../components/common/RedactedText.jsx';
import ScrollFade, { ScrollStaggerContainer, ScrollStaggerItem } from '../../components/common/ScrollFade.jsx';
import { flagshipEvent } from '../../data/events/index.js';
import { Link } from 'react-router-dom';

export default function Home() {
  useDocumentTitle('Home');

  return (
    <>
      <Hero />

      <EventsPreview />

      {/* Flagship spotlight */}
      <section className="border-y border-white/5 bg-ink overflow-hidden py-28 sm:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 sm:gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <ScrollFade direction="left">
            <SectionHeading
              eyebrow={flagshipEvent.caseNumber}
              title={flagshipEvent.name}
              description={flagshipEvent.tagline}
              scrollFloat={true}
            />
            <div className="mt-8 max-w-lg">
              <RedactedText as="p" className="text-steel leading-relaxed">
                {flagshipEvent.description}
              </RedactedText>
            </div>
            <Link to="/hackathon" className="btn-danger mt-10 inline-flex">
              Open Full Case File
            </Link>
          </ScrollFade>

          <ScrollStaggerContainer className="grid grid-cols-2 gap-5 self-start">
            <ScrollStaggerItem direction="up">
              <div className="file-card p-6">
                <div className="noise-overlay" />
                <p className="relative font-mono text-xs uppercase tracking-widest text-steel">Format</p>
                <p className="relative mt-2 font-display text-2xl text-paper">{flagshipEvent.format}</p>
              </div>
            </ScrollStaggerItem>

            <ScrollStaggerItem direction="up">
              <div className="file-card p-6">
                <div className="noise-overlay" />
                <p className="relative font-mono text-xs uppercase tracking-widest text-steel">Team Size</p>
                <p className="relative mt-2 font-display text-2xl text-paper">{flagshipEvent.teamSize}</p>
              </div>
            </ScrollStaggerItem>

            <ScrollStaggerItem direction="up" className="col-span-2">
              <div className="file-card p-6">
                <div className="noise-overlay" />
                <p className="relative font-mono text-xs uppercase tracking-widest text-steel">Duration</p>
                <p className="relative mt-2 font-display text-2xl text-paper">{flagshipEvent.duration}</p>
              </div>
            </ScrollStaggerItem>
          </ScrollStaggerContainer>
        </div>
      </section>

      {/* CTA strip */}
      <ScrollFade direction="up" className="mx-auto max-w-7xl px-4 py-32 sm:py-48 text-center sm:px-6 lg:px-8">
        <span className="case-tag mx-auto">Case Closes Soon</span>
        <h2 className="heading-display mt-6 text-4xl sm:text-6xl sm:leading-tight">Ready to go on record?</h2>
        <p className="mx-auto mt-6 max-w-xl text-steel text-lg">
          Registrations open shortly across all thirteen events. Check the schedule and pick your case.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/events" className="btn-primary">
            Browse Events
          </Link>
          <Link to="/schedule" className="btn-secondary">
            View Schedule
          </Link>
        </div>
      </ScrollFade>
    </>
  );
}
