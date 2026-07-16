import { useParams, Link, Navigate } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { getEventBySlug } from '../../data/events/index.js';

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
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
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

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <InfoBlock label="Format" value={event.format} />
        <InfoBlock label="Team Size" value={event.teamSize} />
        <InfoBlock label="Duration" value={event.duration} />
      </div>

      <p className="mt-10 text-base leading-relaxed text-paper/90">{event.description}</p>

      {event.rounds && (
        <div className="mt-10">
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
        </div>
      )}

      {event.rules && (
        <div className="mt-10">
          <h2 className="case-tag mb-4">Rules</h2>
          <ul className="space-y-2">
            {event.rules.map((rule) => (
              <li key={rule} className="flex gap-3 text-sm text-paper/90">
                <span className="text-evidence">›</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
        <a href={event.registrationLink} className="btn-primary">
          Register Now
        </a>
        <div className="font-mono text-xs uppercase tracking-widest text-steel">
          Venue: {event.venue} · Date: {event.date}
        </div>
      </div>
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
