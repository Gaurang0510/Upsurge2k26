import { useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

    // 2. Scale the dot and add red shadow glow
    const dot = el.querySelector('[data-role="dot"]');
    if (dot) {
      dot.style.transform = `scale(${(1 + v * 0.4).toFixed(3)})`;
      dot.style.boxShadow = `0 0 ${(v * 10).toFixed(1)}px rgba(193, 18, 31, ${(v * 0.8).toFixed(2)})`;
    }

    // 3. Fade in/out the card's crimson border glow and subtle red background highlight
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

  return (
    <div
      ref={listRef}
      className="relative border-l border-white/10 pl-8 py-2"
      onPointerMove={handleMove}
      onMouseMove={handleMove}
      onPointerLeave={handleLeave}
      onMouseLeave={handleLeave}
    >
      {day.blocks.map((block, index) => {
        const event = block.eventSlug ? getEventBySlug(block.eventSlug) : null;
        const detailPath = event ? event.pagePath || `/events/${event.slug}` : null;

        const content = (
          <div className="file-card p-4 relative overflow-hidden transition-colors duration-300">
            <div className="noise-overlay" />
            
            {/* Proximity Border Glow Layer */}
            <div
              data-role="border-glow"
              className="absolute inset-0 border border-evidence pointer-events-none bg-evidence/[0.04] transition-opacity duration-75"
              style={{ opacity: 0 }}
            />

            <p className="relative font-mono text-xs uppercase tracking-widest text-evidence">{block.time}</p>
            <p className="relative mt-1 font-display text-xl tracking-wide text-paper">{block.title}</p>
          </div>
        );

        return (
          <div
            key={`${day.day}-${index}`}
            ref={el => {
              itemRefs.current[index] = el;
            }}
            className="relative mb-6 last:mb-0 transition-transform duration-300 ease-out"
            style={{ willChange: 'transform' }}
          >
            {/* The Dot Marker on Timeline */}
            <span
              data-role="dot"
              className="absolute -left-[38px] top-4 h-3 w-3 rounded-full border-2 border-evidence bg-case-black transition-transform duration-300 ease-out"
              style={{ willChange: 'transform, box-shadow' }}
            />

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
