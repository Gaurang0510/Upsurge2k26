import { useMemo, useState } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import EventCard from '../../components/events/EventCard.jsx';
import EventFilterTabs from '../../components/events/EventFilterTabs.jsx';
import ScrollFade, { ScrollStaggerContainer, ScrollStaggerItem } from '../../components/common/ScrollFade.jsx';
import { events, CATEGORIES } from '../../data/events/index.js';

export default function Events() {
  useDocumentTitle('Events');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredEvents = useMemo(
    () => (activeCategory === 'All' ? events : events.filter((event) => event.category === activeCategory)),
    [activeCategory]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pt-36 pb-28 sm:pt-44 sm:pb-36 sm:px-6 lg:px-8">
      <ScrollFade direction="up">
        <SectionHeading
          eyebrow="Full Case Index"
          title="All Events"
          description="Thirteen open cases across the fest. Filter by category and dig into the file that matches your skill set."
          scrollFloat={true}
        />
      </ScrollFade>

      <ScrollFade direction="up" delay={0.15} className="mt-12">
        <EventFilterTabs categories={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />
      </ScrollFade>

      <ScrollStaggerContainer key={activeCategory} className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <ScrollStaggerItem key={event.id} direction="up">
            <EventCard event={event} />
          </ScrollStaggerItem>
        ))}
      </ScrollStaggerContainer>

      {filteredEvents.length === 0 && (
        <p className="mt-20 text-center font-mono text-sm uppercase tracking-widest text-steel">
          No cases filed under this category yet.
        </p>
      )}
    </div>
  );
}
