import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  const detailPath = event.pagePath || `/events/${event.slug}`;

  return (
    <Link
      to={detailPath}
      className="file-card group flex flex-col justify-between p-6 transition-[border-color,color] duration-200 hover:border-evidence/40 will-change-transform transform-gpu"
    >
      <div className="noise-overlay" />
      <div className="relative flex items-start justify-between">
        <span className="font-mono text-xs tracking-widest text-steel">{event.caseNumber}</span>
        <span className="border border-evidence/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-evidence">
          {event.category}
        </span>
      </div>

      <div className="relative mt-8">
        <h3 className="heading-display text-3xl leading-none text-paper transition-colors group-hover:text-evidence">
          {event.name}
        </h3>
        <p className="mt-3 text-sm text-steel">{event.tagline}</p>
      </div>

      <div className="relative mt-8 flex items-center justify-between border-t border-white/5 pt-4 font-mono text-[11px] uppercase tracking-widest text-steel">
        <span>{event.format}</span>
        <span className="text-evidence opacity-0 transition-opacity group-hover:opacity-100">View File →</span>
      </div>
    </Link>
  );
}
