import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import SectionHeading from '../common/SectionHeading.jsx';

/**
 * CriteriaWheel — A 3D perspective text selector driven by pinned section scrolling with smooth spring interpolation.
 */
function CriteriaWheel({ items, selectedIndex, onSelect }) {
  const ITEM_HEIGHT = 60;
  const VISIBLE_ITEMS = 7;

  return (
    <div className="relative flex flex-col items-start gap-4">
      {/* 3D Wheel Container */}
      <div
        className="relative w-full select-none"
        style={{ height: VISIBLE_ITEMS * ITEM_HEIGHT }}
      >
        {/* Center active indicator highlight */}
        <div
          className="absolute left-0 right-0 pointer-events-none border-l-4 border-evidence bg-evidence/5 rounded-r-lg"
          style={{
            top: Math.floor(VISIBLE_ITEMS / 2) * ITEM_HEIGHT,
            height: ITEM_HEIGHT,
          }}
        />

        {items.map((label, index) => {
          const distance = index - selectedIndex;
          const absDistance = Math.abs(distance);
          const centerSlot = Math.floor(VISIBLE_ITEMS / 2);
          const yPosition = (centerSlot + distance) * ITEM_HEIGHT;

          if (absDistance > Math.floor(VISIBLE_ITEMS / 2) + 1) return null;

          const angle = distance * 11;
          const xShift = Math.abs(distance) * Math.abs(distance) * 10;
          const opacity = Math.max(0.12, 1 - absDistance * 0.22);
          const blurAmount = absDistance * 1.2;
          const scale = Math.max(0.8, 1 - absDistance * 0.05);

          return (
            <div
              key={`${label}-${index}`}
              className="absolute left-0 flex items-center px-4 transition-all duration-300 ease-out cursor-pointer"
              style={{
                top: 0,
                height: ITEM_HEIGHT,
                transform: `translateY(${yPosition}px) translateX(${xShift}px) scale(${scale}) rotateX(${angle}deg)`,
                opacity,
                filter: blurAmount > 0.5 ? `blur(${blurAmount}px)` : 'none',
                transformOrigin: 'left center',
              }}
              onClick={() => onSelect(index)}
            >
              <span
                className={`truncate max-w-[240px] sm:max-w-[320px] lg:max-w-[400px] font-display uppercase tracking-wider transition-all duration-300 ${
                  index === selectedIndex
                    ? 'text-white text-xl sm:text-2xl lg:text-3xl font-bold'
                    : 'text-zinc-500 text-base sm:text-lg font-medium hover:text-zinc-300'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function JudgedOptionWheel({ criteria }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latest) => {
      const idx = Math.min(criteria.length - 1, Math.floor(latest * criteria.length));
      setSelectedIndex(idx);
    });
    return () => unsubscribe();
  }, [smoothProgress, criteria.length]);

  const handleSelect = (index) => {
    setSelectedIndex(index);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollHeight = containerRef.current.clientHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const targetY = window.scrollY + rect.top + (index / (criteria.length - 1)) * scrollHeight;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
  };

  const activeCriterion = criteria[selectedIndex] || criteria[0];
  const wheelLabels = criteria.map((c) => c.title);

  return (
    <div ref={containerRef} className="relative h-[300vh] sm:h-[350vh] w-full">
      {/* Sticky section container pins while scrolling through criteria */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden py-6 sm:py-10">
        {/* Background crimson ambient glow */}
        <div className="pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-evidence/15 rounded-full blur-[140px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-6 sm:gap-8">
          <SectionHeading eyebrow="Evaluation" title="How Teams Are Judged" align="center" />

          <div className="grid gap-8 lg:grid-cols-12 items-center mt-2">
            {/* Left Column: 3D Criteria Wheel */}
            <div className="lg:col-span-6 relative flex flex-col items-center lg:items-start">
              <CriteriaWheel
                items={wheelLabels}
                selectedIndex={selectedIndex}
                onSelect={handleSelect}
              />
            </div>

            {/* Right Column: Selected Criteria Detail Card */}
            <div className="lg:col-span-6 relative z-10 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden border border-white/10 bg-ink/90 backdrop-blur-xl rounded-2xl p-6 sm:p-10 shadow-[0_15px_60px_rgba(0,0,0,0.7)] min-h-[310px] flex flex-col justify-between"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-evidence to-breach" />

                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="case-tag">Criterion {String(selectedIndex + 1).padStart(2, '0')}</span>
                      <span className="font-mono text-sm uppercase tracking-[0.3em] text-evidence font-bold">
                        {String(selectedIndex + 1).padStart(2, '0')} / {String(criteria.length).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wide text-white mt-4 leading-tight break-words">
                      {activeCriterion.title}
                    </h3>

                    <p className="mt-4 text-sm sm:text-base leading-relaxed text-steel break-words">
                      {activeCriterion.detail}
                    </p>
                  </div>

                  <div className="mt-8 space-y-2">
                    <div className="h-2 w-full bg-white/10 overflow-hidden rounded-full">
                      <motion.div
                        className="h-full bg-gradient-to-r from-breach to-evidence rounded-full shadow-[0_0_15px_rgba(193,18,31,0.9)]"
                        initial={{ width: '0%' }}
                        animate={{ width: `${((selectedIndex + 1) / criteria.length) * 100}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-steel pt-1">
                      <span>Evaluation Weight</span>
                      <span className="text-evidence font-bold text-sm">{(100 / criteria.length).toFixed(1)}%</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Sticky scroll hint */}
              <div className="mt-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-white/40 px-1">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-evidence animate-pulse" />
                  Scroll to progress criteria
                </span>
                <span>{selectedIndex + 1} of {criteria.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
