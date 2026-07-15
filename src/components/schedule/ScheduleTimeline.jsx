import { Link } from 'react-router-dom';
import { getEventBySlug } from '../../data/events/index.js';

export default function ScheduleTimeline({ day }) {
  return (
    <div className="relative border-l border-white/10 pl-8">
      {day.blocks.map((block, index) => {
        const event = block.eventSlug ? getEventBySlug(block.eventSlug) : null;
        const detailPath = event ? event.pagePath || `/events/${event.slug}` : null;

        const content = (
          <div className="file-card p-4 transition-colors group-hover:border-evidence/40">
            <div className="noise-overlay" />
            <p className="relative font-mono text-xs uppercase tracking-widest text-evidence">{block.time}</p>
            <p className="relative mt-1 font-display text-xl tracking-wide text-paper">{block.title}</p>
          </div>
        );

        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`${day.day}-${index}`} className="relative mb-6 last:mb-0">
            <span className="absolute -left-[38px] top-4 h-3 w-3 rounded-full border-2 border-evidence bg-case-black" />
            {detailPath ? (
              <Link to={detailPath} className="group block">
                {content}
              </Link>
            ) : (
              content
            )}
          </div>
        );
      })}
    </div>
  );
}
