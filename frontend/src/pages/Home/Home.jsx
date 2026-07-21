import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import Hero from '../../components/home/Hero.jsx';
import PoliceLightbar from '../../components/home/PoliceLightbar.jsx';
import CyberCoffinVault from '../../components/home/CyberCoffinVault.jsx';
import EventsPreview from '../../components/home/EventsPreview.jsx';
import InvestigationTimeline from '../../components/home/InvestigationTimeline.jsx';
import SponsorsMarquee from '../../components/home/SponsorsMarquee.jsx';
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

      {/* Police Emergency Lightbar right below Hero */}
      <PoliceLightbar />

      {/* Interactive 3D Cyber Coffin Vault (Unseal Brochure & Case File) */}
      <CyberCoffinVault />

      {/* Flagship spotlight (SMACKATHON 2K26) with Police Ambient Lighting */}
      <section className="relative border-y border-white/5 bg-ink overflow-hidden py-24 sm:py-32">
        
        {/* Ambient Strobe Lighting Cones across Smackathon Section */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Blue Police Light Ambient Fill (Top-Left) */}
          <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,102,255,0.22)_0%,rgba(0,50,200,0.08)_50%,transparent_75%)] blur-3xl animate-police-strobe-blue" />
          
          {/* Red Police Light Ambient Fill (Top-Right) */}
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,0,51,0.25)_0%,rgba(200,0,30,0.08)_50%,transparent_75%)] blur-3xl animate-police-strobe-red" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 sm:gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
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
              <div className="file-card p-6 border-blue-500/20 shadow-[0_0_20px_rgba(0,102,255,0.15)]">
                <div className="noise-overlay" />
                <p className="relative font-mono text-xs uppercase tracking-widest text-steel">Format</p>
                <p className="relative mt-2 font-display text-2xl text-paper">{flagshipEvent.format}</p>
              </div>
            </ScrollStaggerItem>

            <ScrollStaggerItem direction="up">
              <div className="file-card p-6 border-red-500/20 shadow-[0_0_20px_rgba(255,0,51,0.15)]">
                <div className="noise-overlay" />
                <p className="relative font-mono text-xs uppercase tracking-widest text-steel">Team Size</p>
                <p className="relative mt-2 font-display text-2xl text-paper">{flagshipEvent.teamSize}</p>
              </div>
            </ScrollStaggerItem>

            <ScrollStaggerItem direction="up" className="col-span-2">
              <div className="file-card p-6 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <div className="noise-overlay" />
                <p className="relative font-mono text-xs uppercase tracking-widest text-steel">Duration</p>
                <p className="relative mt-2 font-display text-2xl text-paper">{flagshipEvent.duration}</p>
              </div>
            </ScrollStaggerItem>
          </ScrollStaggerContainer>
        </div>
      </section>

      <EventsPreview />

      <InvestigationTimeline />

      {/* Sponsors 3D Marquee */}
      <SponsorsMarquee />

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
