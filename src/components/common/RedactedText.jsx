import { useEffect, useRef, useState } from 'react';

/**
 * SITE SIGNATURE ELEMENT.
 * Renders text under a solid "redaction" bar that wipes away once the
 * block scrolls into view (or on hover, for inline use) — like a case
 * file being declassified. Used for hero copy, event descriptions, etc.
 *
 * Keep this the ONE recurring bold motif — don't sprinkle extra
 * animated effects elsewhere on the same page (see docs on restraint).
 */
export default function RedactedText({ children, as: Tag = 'p', delay = 0, className = '' }) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setRevealed(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => setRevealed(true), delay);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
        return undefined;
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <span ref={ref} className="relative inline-block w-full">
      <Tag className={className}>{children}</Tag>
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-case-black origin-left"
        style={{
          transform: revealed ? 'scaleX(0)' : 'scaleX(1)',
          transition: 'transform 0.7s cubic-bezier(0.65, 0, 0.35, 1)',
        }}
      />
    </span>
  );
}
