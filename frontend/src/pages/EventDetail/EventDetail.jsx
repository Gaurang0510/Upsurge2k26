import { useParams, Link, Navigate } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { getEventBySlug } from '../../data/events/index.js';
import ScrollFade, { ScrollStaggerContainer, ScrollStaggerItem } from '../../components/common/ScrollFade.jsx';

export default function EventDetail() {
  const { slug } = useParams();
  const event = getEventBySlug(slug);

  useDocumentTitle(event ? event.name : 'Case Not Found');

  if (!event) {
    return <Navigate to="/404" replace />;
  }

  // Flagship events live at their own dedicated route.
  if (event.pagePath) {
    return <Navigate to={event.pagePath} replace />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:pt-32 sm:px-6 lg:px-8">
      <ScrollFade direction="up">
        <Link to="/events" className="font-mono text-xs uppercase tracking-widest text-evidence hover:text-white">
          ← Back to all cases
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="font-mono text-xs tracking-widest text-steel">{event.caseNumber}</span>
          <span className="border border-evidence/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-evidence">
            {event.category}
          </span>
        </div>

        <h1 className="heading-display mt-4 text-5xl sm:text-6xl">{event.name}</h1>
        <p className="mt-3 text-lg text-steel">{event.tagline}</p>
      </ScrollFade>

      <ScrollStaggerContainer className="mt-10 grid gap-4 grid-cols-2 md:grid-cols-5">
        <ScrollStaggerItem direction="up">
          <InfoBlock label="Format" value={event.format} />
        </ScrollStaggerItem>
        <ScrollStaggerItem direction="up">
          <InfoBlock label="Team Size" value={event.teamSize} />
        </ScrollStaggerItem>
        <ScrollStaggerItem direction="up">
          <InfoBlock label="Duration" value={event.duration} />
        </ScrollStaggerItem>
        <ScrollStaggerItem direction="up">
          <InfoBlock label="Entry Fee" value={event.entryFee || 'Free'} />
        </ScrollStaggerItem>
        <ScrollStaggerItem direction="up">
          <InfoBlock 
            label="Prize Pool" 
            value={event.prize ? `${event.prize.currency}${event.prize.total || event.prize.first || 'TBD'}` : 'TBD'} 
          />
        </ScrollStaggerItem>
      </ScrollStaggerContainer>

      <ScrollFade direction="up" className="mt-10 text-base leading-relaxed text-paper/90">
        {event.description}
      </ScrollFade>

      {event.rounds && (
        <ScrollFade direction="up" className="mt-10">
          <h2 className="case-tag mb-4">Rounds</h2>
          <div className="space-y-3">
            {event.rounds.map((round) => (
              <div key={round.title} className="file-card p-4">
                <div className="noise-overlay" />
                <p className="relative font-display text-xl text-paper">{round.title}</p>
                <p className="relative mt-1 text-sm text-steel">{round.description}</p>
              </div>
            ))}
          </div>
        </ScrollFade>
      )}

      {event.rules && (
        <ScrollFade direction="up" className="mt-10">
          <h2 className="case-tag mb-4">Rules</h2>
          <ul className="space-y-2">
            {event.rules.map((rule) => (
              <li key={rule} className="flex gap-3 text-sm text-paper/90">
                <span className="text-evidence">›</span>
                {rule}
              </li>
            ))}
          </ul>
        </ScrollFade>
      )}

      <ScrollFade direction="up" className="mt-12 flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
        {event.slug === 'operation-breach' ? (
          <Link
            to="/register"
            className="btn-primary"
          >
            Register Now
          </Link>
        ) : (
          <>
            {event.registrationLink && event.registrationLink !== '#' && !event.registrationLink.includes('chat.whatsapp.com') && (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Register Now
              </a>
            )}
            {event.whatsappGroup && event.whatsappGroup !== '#' && (
              <a
                href={event.whatsappGroup}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-none font-bold shadow-md shadow-green-950/20"
              >
                Join WhatsApp Group
              </a>
            )}
            {(!event.registrationLink || event.registrationLink === '#') && (!event.whatsappGroup || event.whatsappGroup === '#') && (
              <span className="font-mono text-xs uppercase tracking-widest text-steel">Registration details available from the event organisers.</span>
            )}
          </>
        )}
        <div className="font-mono text-xs uppercase tracking-widest text-steel">
          Venue: {event.venue} · Date: {event.date} {event.time && `· Time: ${event.time}`}
        </div>
      </ScrollFade>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="file-card p-4">
      <div className="noise-overlay" />
      <p className="relative font-mono text-[11px] uppercase tracking-widest text-steel">{label}</p>
      <p className="relative mt-1 font-display text-xl text-paper">{value}</p>
    </div>
  );
}
