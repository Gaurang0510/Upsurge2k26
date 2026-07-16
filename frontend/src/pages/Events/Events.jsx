import { useMemo, useState } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import EventCard from '../../components/events/EventCard.jsx';
import EventFilterTabs from '../../components/events/EventFilterTabs.jsx';
import { events, CATEGORIES } from '../../data/events/index.js';

export default function Events() {
  useDocumentTitle('Events');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredEvents = useMemo(
    () => (activeCategory === 'All' ? events : events.filter((event) => event.category === activeCategory)),
    [activeCategory]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Full Case Index"
        title="All Events"
        description="Thirteen open cases across the fest. Filter by category and dig into the file that matches your skill set."
      />

      <div className="mt-8">
        <EventFilterTabs categories={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <p className="mt-16 text-center font-mono text-sm uppercase tracking-widest text-steel">
          No cases filed under this category yet.
        </p>
      )}
    </div>
  );
}
