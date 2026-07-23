import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import ScheduleTimeline from '../../components/schedule/ScheduleTimeline.jsx';
import ScrollFade from '../../components/common/ScrollFade.jsx';
import { schedule } from '../../data/schedule.js';
import LetterGlitch from '../../components/common/LetterGlitch.jsx';

export default function Schedule() {
  useDocumentTitle('Schedule');
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div className="relative min-h-screen z-0">
      {/* Glitchy Matrix Backdrop */}
      <div className="absolute inset-0 -z-10 opacity-[0.35] pointer-events-none">
        <LetterGlitch
          glitchSpeed={250}
          centerVignette={true}
          outerVignette={true}
          smooth={false}
          glitchColors={['#2b4539', '#61dca3', '#61b3dc']}
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-36 pb-28 sm:pt-44 sm:pb-36 sm:px-6 lg:px-8 relative z-10">
        <ScrollFade direction="up">
          <SectionHeading
            eyebrow="Survival Lobby"
            title="Event Schedule"
            description="Chronological log of operational windows, checkpoints, and festive highlights. Terminals online."
            scrollFloat={true}
          />
        </ScrollFade>

        {/* Cyberpunk Operational Dashboard */}
        <ScrollFade direction="up" delay={0.15}>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white/[0.01] border border-white/5 rounded-lg backdrop-blur-sm font-mono text-xs uppercase tracking-widest text-steel relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#61dca3]/5 via-transparent to-transparent pointer-events-none" />
            <div className="flex flex-col gap-1 border-r border-white/5 last:border-0 pr-2">
              <span className="text-[10px] text-steel/60">OPERATION STATUS</span>
              <span className="text-[#61dca3] font-bold animate-pulse">● LOGGED_ACTIVE</span>
            </div>
            <div className="flex flex-col gap-1 sm:border-r border-white/5 last:border-0 sm:px-2">
              <span className="text-[10px] text-steel/60">DECRYPT SPEED</span>
              <span className="text-white font-bold">982.4 KB/S</span>
            </div>
            <div className="flex flex-col gap-1 border-r border-white/5 last:border-0 pr-2 sm:px-2">
              <span className="text-[10px] text-steel/60">ACTIVE TRACKS</span>
              <span className="text-white font-bold">13 / 13 STABLE</span>
            </div>
            <div className="flex flex-col gap-1 pl-2">
              <span className="text-[10px] text-steel/60">SYSTEM DOMAIN</span>
              <span className="text-[#61dca3] font-bold">NAGPUR_SEC_05</span>
            </div>
          </div>
        </ScrollFade>

        <ScrollFade direction="up" delay={0.25} className="mt-12 flex gap-3 bg-black/40 border border-white/5 p-1 rounded-lg w-fit backdrop-blur-md relative overflow-hidden">
          {schedule.map((day, index) => (
            <button
              key={day.day}
              type="button"
              onClick={() => setActiveDay(index)}
              className={`relative px-6 py-2.5 font-mono text-xs uppercase tracking-widest font-bold z-10 transition-colors duration-300 ${
                activeDay === index ? 'text-white' : 'text-steel hover:text-white'
              }`}
            >
              {day.day}
              {activeDay === index && (
                <motion.div
                  layoutId="scheduleActiveTab"
                  className="absolute inset-0 bg-[#2b4539]/60 border border-[#61dca3]/50 z-[-1]"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 80%, 92% 100%, 0 100%)',
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
            </button>
          ))}
        </ScrollFade>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-[#61dca3] font-bold">{schedule[activeDay].date}</p>

        <div className="mt-10">
          <AnimatePresence mode="wait">
            <ScheduleTimeline key={activeDay} day={schedule[activeDay]} />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
