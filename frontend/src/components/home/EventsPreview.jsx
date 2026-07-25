import { Link } from 'react-router-dom';
import SectionHeading from '../common/SectionHeading.jsx';
import ScrollFade from '../common/ScrollFade.jsx';
import ScrollStack, { ScrollStackItem } from '../events/ScrollStack.jsx';
import { events } from '../../data/events/index.js';

export default function EventsPreview() {
  const preview = events.slice(0, 6);

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-28 sm:py-36 sm:px-6 lg:px-8 overflow-visible">
      <ScrollFade direction="up" className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end mb-16 sm:mb-20">
        <SectionHeading
          eyebrow="Open Cases"
          title="Pick your case."
          description="Thirteen events. Every branch of crime covered — from cyber breaches to the interrogation room."
          scrollFloat={true}
        />
        <Link to="/events" className="btn-secondary shrink-0">
          View All Events
        </Link>
      </ScrollFade>

      {/* Interactive Scroll Stack Events Experience */}
      <ScrollStack>
        {preview.map((event, index) => {
          const isSmackathon = event.slug === 'operation-breach';

          const cardContent = (
            <>
              {/* Yellow Caution Tape Banner */}
              <div className="relative -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 lg:-mx-10 lg:-mt-10 mb-6 overflow-hidden rounded-t-2xl sm:rounded-t-3xl bg-amber-400 py-2 px-4 text-[#000000] border-b-2 border-black shadow-lg">
                <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs font-black uppercase tracking-[0.22em] select-none text-[#000000]">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#000000] text-amber-400 px-2 py-0.5 rounded text-[9px] font-black tracking-widest shadow">CAUTION</span>
                    <span className="font-extrabold text-[#000000]">CRIME SCENE — DO NOT CROSS</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 font-extrabold">
                    <span>EVIDENCE FILE // CLASSIFIED</span>
                    <span className="text-[#000000] font-black">{'///'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-black">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                    <span className="text-[9px] font-black tracking-widest text-[#000000]">RESTRICTED AREA</span>
                  </div>
                </div>
                {/* High contrast dark hazard stripes pattern overlay */}
                <div
                  className="absolute inset-0 opacity-25 pointer-events-none"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(45deg, #000000 0, #000000 14px, transparent 14px, transparent 28px)',
                  }}
                />
              </div>

              {/* Decorative Red Accent Glow & Background Shader Accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-red-950/20 pointer-events-none rounded-2xl sm:rounded-3xl" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 blur-3xl pointer-events-none rounded-full" />

              {/* Card Top Meta Header */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 sm:pb-5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold tracking-widest text-evidence uppercase bg-evidence/10 px-3 py-1 rounded border border-evidence/30">
                    {event.caseNumber}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-paper/70 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                    {event.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-steel">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>{event.format}</span>
                </div>
              </div>

              {/* Card Main Body Grid */}
              <div className="relative z-10 my-6 sm:my-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                {/* Left Column: Title, Tagline, Overview */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wider text-paper hover:text-evidence transition-colors">
                      {event.name}
                    </h3>
                    <p className="mt-2 font-mono text-xs sm:text-sm text-evidence/90 font-medium">
                      {event.tagline}
                    </p>
                    <p className="mt-4 text-xs sm:text-sm leading-relaxed text-steel/90">
                      {event.description}
                    </p>
                  </div>

                  {/* Highlights Preview */}
                  {event.highlights && event.highlights.length > 0 && (
                    <div className="mt-6 border-l-2 border-evidence/50 pl-3 py-1 font-mono text-[11px] text-steel/80">
                      <span className="text-evidence font-bold">&gt; Key Note: </span>
                      <span>{event.highlights[0]}</span>
                    </div>
                  )}
                </div>

                {/* Right Column: Key Specifications Box */}
                <div className="flex flex-col justify-between gap-4 bg-black/50 p-5 sm:p-6 rounded-xl border border-white/10 font-mono text-xs shadow-inner">
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-paper">
                      <span className="text-steel uppercase text-[10px] tracking-wider">Team Size</span>
                      <span className="font-bold text-paper text-sm">{event.teamSize}</span>
                    </div>
                    <div className="flex justify-between items-center text-paper">
                      <span className="text-steel uppercase text-[10px] tracking-wider">Schedule</span>
                      <span className="font-bold text-paper text-sm">{event.date || event.duration}</span>
                    </div>
                    <div className="flex justify-between items-center text-paper">
                      <span className="text-steel uppercase text-[10px] tracking-wider">Venue</span>
                      <span className="font-bold text-paper text-right max-w-[200px] text-xs leading-tight">{event.venue}</span>
                    </div>

                    {event.prize && (
                      <div className="flex justify-between items-center border-t border-white/10 pt-3">
                        <span className="text-steel uppercase text-[10px] tracking-wider">Prize Pool</span>
                        <span className="font-bold text-amber-400 text-sm">
                          {event.prize.currency}{event.prize.total || event.prize.first} + Perks
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-[10px] text-steel/60 uppercase tracking-widest text-center border-t border-white/5 pt-2">
                    Official UPSURGE 2K26 Case File
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 sm:pt-5 mt-auto">
                <Link
                  to={event.pagePath || `/events/${event.slug}`}
                  className="btn-secondary text-xs py-3 px-6 flex items-center gap-2 group/link"
                >
                  <span>VIEW DOSSIER</span>
                  <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                </Link>

                {event.slug === 'operation-breach' ? (
                  <Link to="/register" className="btn-primary text-xs py-3 px-7 font-bold uppercase tracking-widest shadow-lg shadow-red-950/50">
                    REGISTER NOW
                  </Link>
                ) : (
                  <span className="text-xs font-mono uppercase tracking-widest text-steel">See dossier for registration</span>
                )}
              </div>
            </>
          );

          return (
            <ScrollStackItem key={event.id} index={index} total={preview.length}>
              {isSmackathon ? (
                cardContent
              ) : (
                <div className="under-investigation-wrapper -m-6 sm:-m-8 lg:-m-10 p-6 sm:p-8 lg:p-10 min-h-[380px] rounded-2xl sm:rounded-3xl">
                  <div className="under-investigation-blur">
                    {cardContent}
                  </div>
                  <div className="under-investigation-overlay rounded-2xl sm:rounded-3xl">
                    <div className="under-investigation-badge scale-90 sm:scale-100">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                      <h4 className="under-investigation-title">[ Decryption In Progress ]</h4>
                      <p className="under-investigation-text">
                        This event dossier is undergoing verification and will unlock soon. Smackathon is active now!
                      </p>
                      <Link
                        to="/hackathon"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-red-500/50 bg-red-950/20 text-red-400 font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-300 rounded cursor-pointer"
                      >
                        <span>ACCESS ACTIVE SMACKATHON</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </ScrollStackItem>
          );
        })}
      </ScrollStack>
    </section>
  );
}
