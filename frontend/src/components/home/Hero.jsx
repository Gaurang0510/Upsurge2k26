import { Link } from 'react-router-dom';
import RedactedText from '../common/RedactedText.jsx';
import { siteConfig } from '../../data/site.js';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-case-black">
      {/* scanline + noise atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-terminal/10 to-transparent animate-scanline"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-start px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
        <span className="case-tag mb-6">
          <span className="h-2 w-2 animate-blink rounded-full bg-breach" />
          Case File #2K26 — Status: Active
        </span>

        <h1 className="heading-display text-6xl sm:text-7xl lg:text-8xl">
          The system
          <br />
          has been
          <br />
          <span className="text-evidence">compromised.</span>
        </h1>

        <div className="mt-6 max-w-xl">
          <RedactedText as="p" className="text-lg text-steel sm:text-xl" delay={300}>
            {siteConfig.organizer} presents UPSURGE 2K26 — hackathons, cyber-forensics, escape rooms and esports,
            all wrapped in one theme: {siteConfig.theme}. Answer the call, or watch the case go cold.
          </RedactedText>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/hackathon" className="btn-primary">
            Enter Operation Breach
          </Link>
          <Link to="/events" className="btn-secondary">
            View All Cases
          </Link>
        </div>
      </div>
    </section>
  );
}
