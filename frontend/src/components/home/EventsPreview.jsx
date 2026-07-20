import { Link } from 'react-router-dom';
import SectionHeading from '../common/SectionHeading.jsx';
import EventCard from '../events/EventCard.jsx';
import ScrollFade, { ScrollStaggerContainer, ScrollStaggerItem } from '../common/ScrollFade.jsx';
import { events } from '../../data/events/index.js';

export default function EventsPreview() {
  const preview = events.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-28 sm:py-36 sm:px-6 lg:px-8">
      <ScrollFade direction="up" className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
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

      <ScrollStaggerContainer className="mt-16 sm:mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {preview.map((event) => (
          <ScrollStaggerItem key={event.id} direction="up">
            <EventCard event={event} />
          </ScrollStaggerItem>
        ))}
      </ScrollStaggerContainer>
    </section>
  );
}
