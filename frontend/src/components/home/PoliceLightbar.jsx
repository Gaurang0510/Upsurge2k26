import { useState, useEffect } from 'react';

const MODES = [
  'default',
  'alt',
  'spotlight',
  'traffic-default',
  'caution',
  'warn-left',
  'warn-right',
];

export default function PoliceLightbar() {
  const [mode, setMode] = useState('default');

  // Continuously cycle through random light sequences every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMode((currentMode) => {
        const availableModes = MODES.filter((m) => m !== currentMode);
        const nextRandomMode = availableModes[Math.floor(Math.random() * availableModes.length)];
        return nextRandomMode;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Helper to determine class names for each light (1 to 6)
  const getLightClass = (lightId) => {
    if (mode === 'off') return 'light';

    if (mode === 'default') {
      if (lightId <= 3) return 'light strobe blue';
      return 'light strobe red delay';
    }

    if (mode === 'alt') {
      if (lightId % 2 === 1) return 'light strobe blue';
      return 'light strobe red delay';
    }

    if (mode === 'spotlight') {
      if (lightId === 3 || lightId === 4) return 'light spotlight';
      return 'light';
    }

    if (mode === 'traffic-default') {
      if (lightId === 1) return 'light strobe blue';
      if (lightId === 6) return 'light strobe red delay';
      return 'light warn on';
    }

    if (mode === 'caution') {
      return `light caution caution-${lightId}`;
    }

    if (mode === 'warn-left') {
      return `light warn left warn-light-${lightId}`;
    }

    if (mode === 'warn-right') {
      return `light warn right warn-light-${lightId}`;
    }

    return 'light';
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-8 bg-[#050505] border-y border-white/10 select-none z-30">
      
      {/* ── 1. AMBIENT BACKGROUND GLOW BEAMS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mode !== 'off' && (
          <>
            <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-[45vw] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(0,120,255,0.45)_0%,rgba(0,85,255,0.15)_45%,transparent_75%)] blur-3xl animate-police-strobe-blue" />
            <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[45vw] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(255,68,68,0.45)_0%,rgba(220,0,30,0.15)_45%,transparent_75%)] blur-3xl animate-police-strobe-red" />
          </>
        )}
      </div>

      <div className="relative z-10 w-full max-w-[1020px] px-4 flex flex-col items-center">
        
        {/* ── 2. HUD STATUS BADGE ── */}
        <div className="flex items-center gap-2.5 px-4 py-1.5 bg-[#0a0c14]/90 border border-zinc-700/80 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md mb-6">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <h3 className="font-mono text-[10px] sm:text-xs font-black tracking-[0.25em] text-zinc-200 uppercase text-center">
            POLICE BEACON // MODE: {mode.toUpperCase()}
          </h3>
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
        </div>

        {/* ── 3. MOUNTING BRACKET TOP RAIL ── */}
        <div className="w-[85%] max-w-[820px] h-1.5 bg-gradient-to-r from-zinc-800 via-zinc-400 via-50% to-zinc-800 rounded-t-sm shadow-md z-0" />

        {/* ── 4. LIGHT BAR ASSEMBLY ── */}
        <div className="lightbar-container relative w-full flex items-center justify-between gap-1.5 sm:gap-2.5 p-2 sm:p-3.5 bg-gradient-to-b from-[#1a1a20] via-[#0d0d12] to-[#050508] border-2 border-zinc-700/80 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden z-10">
          
          {/* Glass Lens Reflection Highlight Line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent z-50 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent z-50 pointer-events-none" />

          {/* Left Lights (1, 2, 3) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {[1, 2, 3].map((id) => (
              <div
                key={`light-${id}`}
                id={`light-${id}`}
                className={getLightClass(id)}
              >
                <div className="inner-light" />
                {Array.from({ length: 18 }).map((_, bIdx) => (
                  <span key={`bulb-${id}-${bIdx}`} className="bulb" />
                ))}
              </div>
            ))}
          </div>

          {/* Center Police Speaker / Housing Unit */}
          <div className="lightbar-speaker relative z-40 bg-gradient-to-b from-zinc-800 via-zinc-950 to-zinc-900 border-x border-zinc-700 rounded-sm flex flex-col items-center justify-center shadow-2xl px-0.5 shrink-0">
            <div className="w-full flex justify-center gap-0.5 mb-0.5">
              <div className="speaker-slot w-0.5 bg-zinc-700 rounded-full" />
              <div className="speaker-slot w-0.5 bg-zinc-700 rounded-full" />
              <div className="speaker-slot w-0.5 bg-zinc-700 rounded-full" />
            </div>
            <span className="speaker-text font-mono font-black tracking-[0.2em] text-zinc-300 uppercase leading-none">
              POLICE
            </span>
          </div>

          {/* Right Lights (4, 5, 6) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {[4, 5, 6].map((id) => (
              <div
                key={`light-${id}`}
                id={`light-${id}`}
                className={getLightClass(id)}
              >
                <div className="inner-light" />
                {Array.from({ length: 18 }).map((_, bIdx) => (
                  <span key={`bulb-${id}-${bIdx}`} className="bulb" />
                ))}
              </div>
            ))}
          </div>

        </div>

        {/* ── 5. MOUNTING STAND BASE ── */}
        <div className="w-[80%] max-w-[780px] h-2 bg-gradient-to-r from-zinc-900 via-zinc-600 via-50% to-zinc-900 rounded-b-md shadow-xl z-0" />

      </div>
    </div>
  );
}
