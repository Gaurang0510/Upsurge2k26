import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import ProfileCard from './ProfileCard.jsx';

/**
 * ChromaGrid — Authentic React Bits cursor-following grayscale-to-color reveal.
 * No white spotlight beam. Pure grayscale mask with smooth radial reveal.
 */
const ChromaGrid = ({
  items,
  className = '',
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out'
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const data = items?.length ? items : [];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true
    });
  };

  const handleMove = e => {
    if (!rootRef.current) return;
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    if (fadeRef.current) {
      gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
    }
  };

  const handleLeave = () => {
    if (fadeRef.current) {
      gsap.to(fadeRef.current, {
        opacity: 1,
        duration: fadeOut,
        overwrite: true
      });
    }
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`relative w-full flex flex-wrap justify-center items-start gap-6 sm:gap-8 lg:gap-10 ${className}`}
      style={{
        '--r': `${radius}px`,
        '--x': '50%',
        '--y': '50%'
      }}
    >
      {/* Cards */}
      {data.map((c, i) => (
        <div key={i} className="relative z-10 flex justify-center">
          <ProfileCard
            name={c.name || c.title || 'Member'}
            title={c.role || c.subtitle || 'PRESIDENT'}
            committee={c.committee || (i % 2 === 0 ? 'COSMOS' : 'ACM')}
            socials={c.socials || { instagram: '#', linkedin: '#', github: '#' }}
            handle={c.handle || `unit_${i + 1}`}
            avatarUrl={c.photo || c.image || '/images/team/placeholder.svg'}
            enableTilt={true}
            behindGlowEnabled={false}
            borderColor={c.borderColor}
            innerGradient={c.gradient || 'linear-gradient(160deg, #A80028 0%, #700018 50%, #45000E 100%)'}
          />
        </div>
      ))}

      {/* Grayscale mask — hides color by default, reveals vivid color in cursor radius */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none z-30"
        style={{
          backdropFilter: 'grayscale(1) brightness(0.78)',
          WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
          background: 'rgba(0,0,0,0.001)',
          maskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, transparent 15%, rgba(0,0,0,0.10) 30%, rgba(0,0,0,0.22) 45%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.50) 75%, rgba(0,0,0,0.68) 88%, white 100%)',
          WebkitMaskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, transparent 15%, rgba(0,0,0,0.10) 30%, rgba(0,0,0,0.22) 45%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.50) 75%, rgba(0,0,0,0.68) 88%, white 100%)'
        }}
      />

      {/* Fade-in resting state overlay (inverted mask) */}
      <div
        ref={fadeRef}
        className="hidden md:block absolute inset-0 pointer-events-none transition-opacity duration-[250ms] z-40"
        style={{
          backdropFilter: 'grayscale(1) brightness(0.78)',
          WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
          background: 'rgba(0,0,0,0.001)',
          maskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, white 15%, rgba(255,255,255,0.90) 30%, rgba(255,255,255,0.78) 45%, rgba(255,255,255,0.65) 60%, rgba(255,255,255,0.50) 75%, rgba(255,255,255,0.32) 88%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, white 15%, rgba(255,255,255,0.90) 30%, rgba(255,255,255,0.78) 45%, rgba(255,255,255,0.65) 60%, rgba(255,255,255,0.50) 75%, rgba(255,255,255,0.32) 88%, transparent 100%)',
          opacity: 1
        }}
      />
    </div>
  );
};

export default ChromaGrid;
