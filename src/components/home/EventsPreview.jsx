import { Link } from 'react-router-dom';
import SectionHeading from '../common/SectionHeading.jsx';
import EventCard from '../events/EventCard.jsx';
import { events } from '../../data/events/index.js';

export default function EventsPreview() {
  const preview = events.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Open Cases"
          title="Pick your case."
          description="Thirteen events. Every branch of crime covered — from cyber breaches to the interrogation room."
        />
        <Link to="/events" className="btn-secondary shrink-0">
          View All Events
        </Link>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {preview.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
