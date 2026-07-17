import { useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getEventBySlug } from '../../data/events/index.js';

const FALLOFF_CURVES = {
  linear: p => p,
  smooth: p => p * p * (3 - 2 * p),
  sharp: p => p * p * p
};

export default function ScheduleTimeline({ day }) {
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const targetsRef = useRef([]);
  const currentRef = useRef([]);
  const rafRef = useRef(null);
  const lastRef = useRef(0);

  const proximityRadius = 160;
  const maxShift = 24;
  const smoothing = 100; // ms

  // Apply real-time styles to the list item based on proximity effect value v (0 to 1)
  const applyEffect = useCallback((el, v) => {
    if (!el) return;

    // 1. Shift the card container horizontally
    el.style.transform = `translateX(${(v * maxShift).toFixed(1)}px)`;

    // 2. Scale the dot and add green shadow glow
    const dot = el.querySelector('[data-role="dot"]');
    if (dot) {
      dot.style.transform = `scale(${(1 + v * 0.4).toFixed(3)})`;
      dot.style.boxShadow = `0 0 ${(v * 10).toFixed(1)}px rgba(97, 220, 163, ${(v * 0.8).toFixed(2)})`;
    }

    // 3. Fade in/out the card's green border glow and subtle background highlight
    const borderGlow = el.querySelector('[data-role="border-glow"]');
    if (borderGlow) {
      borderGlow.style.opacity = v.toFixed(3);
    }
  }, [maxShift]);

  const runFrame = useCallback(now => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const tau = Math.max(smoothing, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    let moving = false;
    const els = itemRefs.current;
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      if (!el) continue;
      const target = targetsRef.current[i] || 0;
      const cur = currentRef.current[i] || 0;
      const next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.0015;
      const v = settled ? target : next;
      currentRef.current[i] = v;
      applyEffect(el, v);
      if (!el.dataset.settled || !settled) {
        moving = true;
      }
    }

    rafRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, [applyEffect, smoothing]);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) return;
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const handleMove = useCallback(
    e => {
      const list = listRef.current;
      if (!list) return;
      const ease = FALLOFF_CURVES.smooth;
      const els = itemRefs.current;
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(e.clientY - center);
        targetsRef.current[i] = ease(Math.max(0, 1 - distance / proximityRadius));
      }
      startLoop();
    },
    [proximityRadius, startLoop]
  );

  const handleLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    startLoop();
  }, [startLoop]);

  // Clean up animation loop on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -16, y: 10 },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 140,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      ref={listRef}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative pl-8 py-2"
      onPointerMove={handleMove}
      onMouseMove={handleMove}
      onPointerLeave={handleLeave}
      onMouseLeave={handleLeave}
    >
      {/* Timeline line visual overlay */}
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#61dca3]/40 via-[#61dca3]/20 to-transparent pointer-events-none" />

      {day.blocks.map((block, index) => {
        const event = block.eventSlug ? getEventBySlug(block.eventSlug) : null;

        const content = (
          <div className="file-card p-5 relative overflow-hidden transition-all duration-300 bg-white/[0.02] border border-white/5 backdrop-blur-md hover:border-[#61dca3]/20 rounded-lg group">
            <div className="noise-overlay" />
            
            {/* Proximity Border Glow Layer */}
            <div
              data-role="border-glow"
              className="absolute inset-0 border border-[#61dca3]/40 pointer-events-none bg-[#61dca3]/[0.03] transition-opacity duration-75 rounded-lg"
              style={{ opacity: 0 }}
            />

            <div className="flex items-center justify-between relative z-10">
              <span className="font-mono text-xs uppercase tracking-widest text-[#61dca3] font-bold bg-[#61dca3]/10 px-2 py-0.5 rounded border border-[#61dca3]/20">
                {block.time}
              </span>
              {event && (
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-steel">
                  [ PIPELINE ONLINE ]
                </span>
              )}
            </div>
            
            <p className="relative mt-3 font-display text-xl tracking-wide text-paper font-bold group-hover:text-[#61dca3] transition-colors duration-300">
              {block.title}
            </p>

            {event && (
              <div className="relative mt-4 pt-3 border-t border-white/5 flex items-center justify-between z-10">
                <div className="flex gap-2">
                  <span className="border border-white/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-steel rounded">
                    {event.category}
                  </span>
                  <span className="border border-white/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-steel rounded">
                    Size: {event.teamSize}
                  </span>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#61dca3]/60">
                  SYSTEM READY
                </span>
              </div>
            )}
          </div>
        );

        return (
          <motion.div
            key={`${day.day}-${index}`}
            ref={el => {
              itemRefs.current[index] = el;
            }}
            variants={itemVariants}
            className="relative mb-6 last:mb-0"
            style={{ willChange: 'transform' }}
          >
            {/* The Dot Marker on Timeline */}
            <span
              data-role="dot"
              className="absolute -left-[38px] top-6 h-3.5 w-3.5 rounded-full border-2 border-[#61dca3] bg-case-black transition-transform duration-300 ease-out z-10"
              style={{ willChange: 'transform, box-shadow' }}
            />

            {content}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
