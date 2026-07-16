import React, { useRef, useCallback, useMemo } from 'react';

// Holographic pattern SVG data URI
const DEFAULT_HOLO_PATTERN = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">
  <g fill="%23ffffff" opacity="0.8">
    <path d="M20 20 L28 20 L24 28 Z" />
    <path d="M80 18 L86 12 L92 18 L86 24 Z" />
    <circle cx="118" cy="30" r="3" />
    <path d="M40 55 M35 60 L45 60 M40 55 L40 65" stroke="%23ffffff" stroke-width="2" />
    <path d="M100 65 L108 65 L104 73 Z" />
    <circle cx="22" cy="90" r="3.5" />
    <path d="M65 95 L72 89 L79 95 L72 101 Z" />
    <path d="M115 110 L123 110 L119 118 Z" />
    <path d="M48 125 L56 125 L52 133 Z" />
  </g>
</svg>
`)}`;

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

// Inject keyframes once
const KEYFRAMES_ID = 'pc-keyframes';
if (typeof document !== 'undefined' && !document.getElementById(KEYFRAMES_ID)) {
  const style = document.createElement('style');
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes pc-holo-bg {
      0% { background-position: 0 var(--background-y), 0 0, center; }
      100% { background-position: 0 var(--background-y), 90% 90%, center; }
    }
  `;
  document.head.appendChild(style);
}

// Social Media Brand Icons
const InstagramIcon = () => (
  <svg className="w-5 h-5 hover:scale-115 transition-transform" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
    <path d="M12 7.5A4.5 4.5 0 1016.5 12 4.5 4.5 0 0012 7.5zm0 7.4A2.9 2.9 0 1114.9 12 2.9 2.9 0 0112 14.9z" fill="white" />
    <circle cx="16.5" cy="7.5" r="1.1" fill="white" />
    <path d="M12 3.8c2.7 0 3 .1 4 .1a5.6 5.6 0 011.9.4 3.3 3.3 0 011.9 1.9c.3.6.4 1.2.4 1.9v7.8c0 2.7-.1 3-.1 4a5.6 5.6 0 01-.4 1.9 3.3 3.3 0 01-1.9 1.9c-.6.3-1.2.4-1.9.4H8.1c-2.7 0-3-.1-4-.1a5.6 5.6 0 01-1.9-.4 3.3 3.3 0 01-1.9-1.9c-.3-.6-.4-1.2-.4-1.9V8.1c0-2.7.1-3 .1-4a5.6 5.6 0 01.4-1.9 3.3 3.3 0 011.9-1.9c.6-.3 1.2-.4 1.9-.4H12z" stroke="white" strokeWidth="1.2" fill="none" />
    <defs>
      <linearGradient id="ig-grad" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="25%" stopColor="#fdf497" />
        <stop offset="50%" stopColor="#fd5949" />
        <stop offset="75%" stopColor="#d6249f" />
        <stop offset="100%" stopColor="#285AEB" />
      </linearGradient>
    </defs>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-5 h-5 hover:scale-115 transition-transform" viewBox="0 0 24 24" fill="#0077B5">
    <rect width="24" height="24" rx="4" />
    <path d="M6.5 8.5H9.5V18H6.5V8.5ZM8 4.75C7.03 4.75 6.25 5.53 6.25 6.5C6.25 7.47 7.03 8.25 8 8.25C8.97 8.25 9.75 7.47 9.75 6.5C9.75 5.53 8.97 4.75 8 4.75ZM11.5 8.5H14.3V9.8H14.34C14.73 9.06 15.68 8.28 17.1 8.28C20.03 8.28 20.5 10.21 20.5 12.72V18H17.5V13.3C17.5 12.18 17.48 10.74 15.94 10.74C14.38 10.74 14.14 11.96 14.14 13.22V18H11.14V8.5H11.5Z" fill="white" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5 hover:scale-115 transition-transform" viewBox="0 0 24 24" fill="#181717">
    <circle cx="12" cy="12" r="12" fill="#181717" />
    <path fillRule="evenodd" clipRule="evenodd" d="M12 4C7.58 4 4 7.58 4 12C4 15.54 6.29 18.53 9.47 19.59C9.87 19.66 10.02 19.42 10.02 19.21C10.02 19.02 10.01 18.39 10.01 17.72C7.77 18.2 7.3 16.78 7.3 16.78C6.93 15.85 6.4 15.6 6.4 15.6C5.67 15.1 6.46 15.11 6.46 15.11C7.27 15.17 7.69 15.94 7.69 15.94C8.41 17.17 9.57 16.81 10.03 16.6C10.1 16.08 10.31 15.72 10.54 15.52C8.75 15.32 6.87 14.63 6.87 11.54C6.87 10.66 7.18 9.94 7.69 9.38C7.61 9.18 7.33 8.36 7.77 7.25C7.77 7.25 8.45 7.03 10 8.08C10.65 7.9 11.34 7.81 12.03 7.81C12.72 7.81 13.41 7.9 14.06 8.08C15.61 7.03 16.29 7.25 16.29 7.25C16.73 8.36 16.45 9.18 16.37 9.38C16.88 9.94 17.19 10.66 17.19 11.54C17.19 14.64 15.3 15.32 13.5 15.52C13.8 15.78 14.07 16.3 14.07 17.1C14.07 18.25 14.06 18.99 14.06 19.21C14.06 19.42 14.21 19.67 14.62 19.59C17.71 18.53 20 15.54 20 12C20 7.58 16.42 4 12 4Z" fill="white" />
  </svg>
);

const ProfileCardComponent = ({
  avatarUrl = '/images/team/placeholder.svg',
  committee = 'COSMOS',
  name = 'Paras Kalbande',
  title = 'PRESIDENT',
  socials = { instagram: '#', linkedin: '#', github: '#' },
  iconUrl,
  innerGradient = 'linear-gradient(160deg, #8B001A 0%, #4A000E 60%, #150004 100%)',
  borderColor = '#E23744',
  enableTilt = true,
  className = ''
}) => {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);

  const activeIconPattern = useMemo(() => {
    if (iconUrl && !iconUrl.includes('Placeholder')) return iconUrl;
    return DEFAULT_HOLO_PATTERN;
  }, [iconUrl]);

  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;

    let rafId = null;
    let running = false;
    let lastTs = 0;
    let currentX = 0, currentY = 0, targetX = 0, targetY = 0;

    const setVarsFromXY = (x, y) => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;

      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-(centerX / 5))}deg`,
        '--rotate-y': `${round(centerY / 4)}deg`
      };

      for (const [k, v] of Object.entries(properties)) wrap.style.setProperty(k, v);
    };

    const step = ts => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const k = 1 - Math.exp(-dt / 0.18);
      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;

      setVarsFromXY(currentX, currentY);

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x, y) {
        currentX = x; currentY = y; setVarsFromXY(x, y);
      },
      setTarget(x, y) {
        targetX = x; targetY = y; start();
      },
      toCenter() {
        const shell = shellRef.current;
        if (!shell) return;
        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null; running = false;
      }
    };
  }, [enableTilt]);

  const handlePointerMove = useCallback((e) => {
    const shell = shellRef.current;
    if (!shell || !tiltEngine) return;
    const r = shell.getBoundingClientRect();
    tiltEngine.setTarget(e.clientX - r.left, e.clientY - r.top);
  }, [tiltEngine]);

  const handlePointerLeave = useCallback(() => {
    if (tiltEngine) tiltEngine.toCenter();
  }, [tiltEngine]);

  const cardRadius = '20px';

  const cardStyle = useMemo(() => ({
    '--icon': `url("${activeIconPattern}")`,
    '--inner-gradient': innerGradient,
    '--card-border': borderColor || 'transparent',
    '--mouse-x': '50%',
    '--mouse-y': '50%',
    '--spotlight-color': 'rgba(255,255,255,0.3)',
    '--pointer-x': '50%',
    '--pointer-y': '50%',
    '--pointer-from-center': '0',
    '--pointer-from-top': '0.5',
    '--pointer-from-left': '0.5',
    '--rotate-x': '0deg',
    '--rotate-y': '0deg',
    '--sunpillar-1': 'hsl(2, 100%, 73%)',
    '--sunpillar-2': 'hsl(53, 100%, 69%)',
    '--sunpillar-3': 'hsl(93, 100%, 69%)',
    '--sunpillar-4': 'hsl(176, 100%, 76%)',
    '--sunpillar-5': 'hsl(228, 100%, 74%)',
    '--sunpillar-6': 'hsl(283, 100%, 73%)',
    '--sunpillar-clr-1': 'var(--sunpillar-1)',
    '--sunpillar-clr-2': 'var(--sunpillar-2)',
    '--sunpillar-clr-3': 'var(--sunpillar-3)',
    '--sunpillar-clr-4': 'var(--sunpillar-4)',
    '--sunpillar-clr-5': 'var(--sunpillar-5)',
    '--sunpillar-clr-6': 'var(--sunpillar-6)'
  }), [activeIconPattern, innerGradient, borderColor]);

  const shineStyle = {
    maskImage: 'var(--icon)',
    WebkitMaskImage: 'var(--icon)',
    maskMode: 'luminance',
    WebkitMaskMode: 'luminance',
    maskRepeat: 'repeat',
    WebkitMaskRepeat: 'repeat',
    maskSize: '160px',
    WebkitMaskSize: '160px',
    maskPosition: 'top calc(200% - (var(--background-y) * 5)) left calc(100% - var(--background-x))',
    WebkitMaskPosition: 'top calc(200% - (var(--background-y) * 5)) left calc(100% - var(--background-x))',
    filter: 'brightness(0.9) contrast(1.4) saturate(0.9) opacity(0.8)',
    animation: 'pc-holo-bg 18s linear infinite',
    mixBlendMode: 'color-dodge',
    '--space': '5%',
    '--angle': '-45deg',
    transform: 'translate3d(0, 0, 1px)',
    overflow: 'hidden',
    zIndex: 3,
    background: 'transparent',
    backgroundImage: `
      repeating-linear-gradient(
        0deg,
        var(--sunpillar-clr-1) calc(var(--space) * 1),
        var(--sunpillar-clr-2) calc(var(--space) * 2),
        var(--sunpillar-clr-3) calc(var(--space) * 3),
        var(--sunpillar-clr-4) calc(var(--space) * 4),
        var(--sunpillar-clr-5) calc(var(--space) * 5),
        var(--sunpillar-clr-6) calc(var(--space) * 6),
        var(--sunpillar-clr-1) calc(var(--space) * 7)
      )
    `.replace(/\s+/g, ' '),
    gridArea: '1 / -1',
    borderRadius: cardRadius,
    pointerEvents: 'none'
  };

  const glareStyle = {
    transform: 'translate3d(0, 0, 1.1px)',
    overflow: 'hidden',
    backgroundImage: `radial-gradient(
      farthest-corner circle at var(--pointer-x) var(--pointer-y),
      hsla(0, 0%, 100%, 0.35) 10%,
      hsla(350, 60%, 20%, 0.75) 90%
    )`,
    mixBlendMode: 'overlay',
    zIndex: 4,
    gridArea: '1 / -1',
    borderRadius: cardRadius,
    pointerEvents: 'none'
  };

  // Per-card mouse spotlight handler (from original React Bits)
  const handleCardMouseMove = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative touch-none ${className}`.trim()}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onMouseMove={handleCardMouseMove}
      style={{ perspective: '600px', transform: 'translate3d(0, 0, 0.1px)', ...cardStyle }}
    >

      <div ref={shellRef} className="relative z-[1] group">
        {/* Glassmorphism Border Glow Shell */}
        <div
          className="relative rounded-[22px] p-[2px] transition-all duration-500 ease-out w-[260px] h-[380px] sm:w-[280px] sm:h-[410px] lg:w-[300px] lg:h-[430px]"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 0 15px 2px rgba(226,55,68,0.0), 0 20px 45px rgba(0,0,0,0.85), inset 0 0 0 0.5px rgba(255,255,255,0.15)',
            '--glow-color': `var(--card-border, #E23744)`
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.16) 100%)';
            e.currentTarget.style.boxShadow = `0 0 35px 8px color-mix(in srgb, var(--card-border) 40%, transparent), 0 0 80px 15px color-mix(in srgb, var(--card-border) 15%, transparent), 0 20px 50px rgba(0,0,0,0.75), inset 0 0 0 0.5px rgba(255,255,255,0.25)`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)';
            e.currentTarget.style.boxShadow = '0 0 15px 2px rgba(226,55,68,0.0), 0 20px 45px rgba(0,0,0,0.85), inset 0 0 0 0.5px rgba(255,255,255,0.15)';
          }}
        >
        <section
          className="relative overflow-hidden backface-hidden w-full h-full"
          style={{
            borderRadius: cardRadius,
            transition: 'transform 1s ease',
            transform: 'translateZ(0) rotateX(0deg) rotateY(0deg)',
            background: 'var(--inner-gradient)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transition = 'none';
            e.currentTarget.style.transform = 'translateZ(0) rotateX(var(--rotate-y)) rotateY(var(--rotate-x))';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transition = 'transform 0.8s ease';
            e.currentTarget.style.transform = 'translateZ(0) rotateX(0deg) rotateY(0deg)';
          }}
        >
          {/* Per-card hover spotlight (from original React Bits ChromaGrid) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)',
              borderRadius: cardRadius
            }}
          />
          {/* Top-Left Ribbon / Committee Badge (COSMOS / ACM) */}
          {committee && (
            <div className="absolute top-0 left-0 z-20 pointer-events-none overflow-hidden w-28 h-28">
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black font-mono font-black text-[11px] tracking-widest uppercase shadow-md py-1 px-8 text-center -rotate-45 -translate-x-8 translate-y-4 border-b border-amber-300">
                {committee}
              </div>
            </div>
          )}

          {/* Holographic pattern shine layer */}
          <div style={shineStyle} />

          {/* Glare layer */}
          <div style={glareStyle} />

          {/* Member Portrait Image Frame (Full height, completely unobstructed) */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-zinc-900">
            <img
              src={avatarUrl}
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover object-top brightness-105 contrast-105"
              onError={e => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
              }}
            />
            {/* Dark gradient vignette at bottom to ground text */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/95 pointer-events-none" />
          </div>

          {/* Single Compact Frosted Glassmorphism Panel (Only at bottom) */}
          <div
            className="absolute left-3 right-3 bottom-3 z-10 flex flex-col items-center text-center border border-white/20 shadow-2xl transition-all duration-300 backdrop-blur-2xl"
            style={{
              background: 'rgba(12, 14, 15, 0.75)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: '18px',
              padding: '12px 10px'
            }}
          >
            {/* Member Name (Displayed ONCE in clear bold white font) */}
            <h3 className="font-display font-bold text-lg text-white tracking-wide m-0 drop-shadow-md">
              {name}
            </h3>

            {/* Member Position Title Badge */}
            <div className="mt-0.5 mb-2.5">
              <span className="font-mono font-bold text-[10px] uppercase tracking-widest text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-500/30 inline-block shadow-sm">
                {title}
              </span>
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center justify-center gap-4 pt-1.5 border-t border-white/15 w-full">
              {socials?.instagram && (
                <a href={socials.instagram} target="_blank" rel="noreferrer" title="Instagram">
                  <InstagramIcon />
                </a>
              )}
              {socials?.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noreferrer" title="LinkedIn">
                  <LinkedinIcon />
                </a>
              )}
              {socials?.github && (
                <a href={socials.github} target="_blank" rel="noreferrer" title="GitHub">
                  <GithubIcon />
                </a>
              )}
            </div>
          </div>
        </section>
        </div>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
