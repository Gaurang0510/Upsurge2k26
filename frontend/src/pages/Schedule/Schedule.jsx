import { useState } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import ScheduleTimeline from '../../components/schedule/ScheduleTimeline.jsx';
import { schedule } from '../../data/schedule.js';
import LetterGlitch from '../../components/common/LetterGlitch.jsx';

export default function Schedule() {
  useDocumentTitle('Schedule');
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div className="relative min-h-screen z-0">
      {/* Glitchy Matrix Backdrop */}
      <div className="absolute inset-0 -z-10 opacity-[0.45] pointer-events-none">
        <LetterGlitch
          glitchSpeed={80}
          centerVignette={true}
          outerVignette={true}
          smooth={true}
          glitchColors={['#2b4539', '#61dca3', '#61b3dc']}
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          eyebrow="Survival Lobby"
          title="Event Schedule"
          description="Follow the timeline. Every checkpoint links back to its case file."
        />

        <div className="mt-8 flex gap-2">
          {schedule.map((day, index) => (
            <button
              key={day.day}
              type="button"
              onClick={() => setActiveDay(index)}
              className={`border px-6 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${activeDay === index
                ? 'border-evidence bg-evidence text-case-black'
                : 'border-white/10 text-steel hover:border-evidence/40 hover:text-evidence'
                }`}
            >
              {day.day}
            </button>
          ))}
        </div>

        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-steel">{schedule[activeDay].date}</p>

        <div className="mt-10">
          <ScheduleTimeline day={schedule[activeDay]} />
        </div>
      </div>
    </div>
  );
}
