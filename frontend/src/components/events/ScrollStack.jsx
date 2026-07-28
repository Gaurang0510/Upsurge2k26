import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, index = 0, total = 1, itemClassName = '' }) => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  // Smooth GPU scale calculation clamped for high performance
  const scale = useTransform(scrollYProgress, [0, 1], [1, Math.max(0.92, 1 - (total - index) * 0.005)]);

  // Sticky top positioning: pins 115px from top + 12px offset per card
  const stickyTop = 115 + Math.min(index, 8) * 12;

  return (
    <div
      ref={containerRef}
      className="sticky w-full"
      style={{
        top: `${stickyTop}px`,
        zIndex: index + 1,
        marginBottom: index === total - 1 ? '0px' : '32px',
      }}
    >
      <motion.div
        style={{ scale }}
        className={`scroll-stack-card relative w-full rounded-2xl sm:rounded-3xl border border-white/12 bg-ink p-6 sm:p-8 lg:p-10 ${itemClassName}`.trim()}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default function ScrollStack({ children, className = '' }) {
  return (
    <div className={`relative w-full max-w-6xl mx-auto space-y-6 pb-20 ${className}`.trim()}>
      {children}
    </div>
  );
}
