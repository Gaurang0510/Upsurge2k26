import React from 'react';

// Inject keyframes for skeleton shimmer once
const SKELETON_KEYFRAMES_ID = 'ts-keyframes';
if (typeof document !== 'undefined' && !document.getElementById(SKELETON_KEYFRAMES_ID)) {
  const style = document.createElement('style');
  style.id = SKELETON_KEYFRAMES_ID;
  style.textContent = `
    @keyframes ts-shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `;
  document.head.appendChild(style);
}

export function ProfileCardSkeleton() {
  const cardRadius = '20px';

  return (
    <div
      className="relative rounded-[22px] p-[2px] transition-all duration-500 ease-out w-[240px] h-[360px] xs:w-[260px] xs:h-[380px] sm:w-[280px] sm:h-[410px] lg:w-[300px] lg:h-[430px]"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 20px 45px rgba(0,0,0,0.85), inset 0 0 0 0.5px rgba(255,255,255,0.05)',
      }}
    >
      <section
        className="relative overflow-hidden backface-hidden w-full h-full bg-[#08090a]"
        style={{
          borderRadius: cardRadius,
        }}
      >
        {/* Shimmer overlay */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(226, 55, 68, 0.08) 50%, transparent 100%)',
            animation: 'ts-shimmer 2s infinite linear',
            width: '200%',
          }}
        />

        {/* Member Portrait Image Frame Placeholder */}
        <div className="absolute inset-0 z-0 bg-zinc-900/40 pointer-events-none" />

        {/* Committee Badge Placeholder */}
        <div className="absolute top-4 left-4 z-20 w-16 h-4 bg-zinc-800/80 rounded animate-pulse" />

        {/* Bottom Frosted Glassmorphism Panel */}
        <div
          className="absolute left-3 right-3 bottom-3 z-10 flex flex-col items-center text-center border border-white/10 shadow-2xl backdrop-blur-2xl"
          style={{
            background: 'rgba(12, 14, 15, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '18px',
            padding: '12px 10px',
          }}
        >
          {/* Member Name Placeholder */}
          <div className="h-5 bg-zinc-800/80 w-3/4 rounded-full mb-2.5 animate-pulse" />

          {/* Member Position Title Badge Placeholder */}
          <div className="h-4.5 bg-cyan-950/40 border border-cyan-500/10 w-1/2 rounded-md mb-2.5 animate-pulse" />

          {/* Social Icons Row Placeholder */}
          <div className="flex items-center justify-center gap-4 pt-2 border-t border-white/10 w-full animate-pulse">
            <div className="w-5 h-5 rounded-full bg-zinc-800/70" />
            <div className="w-5 h-5 rounded-full bg-zinc-800/70" />
            <div className="w-5 h-5 rounded-full bg-zinc-800/70" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function TeamSkeleton() {
  // Simulate 3 placeholder departments to match the visual weight of the page
  const skeletonDepts = [
    { name: 'Core Committee', count: 4 },
    { name: 'Technical Team', count: 4 },
    { name: 'Event Management Team', count: 4 }
  ];

  return (
    <div className="space-y-24 sm:space-y-36">
      {skeletonDepts.map((dept, index) => (
        <section key={index} className="mb-20">
          {/* Department Header Skeleton */}
          <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-3 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-red-600/40" />
              <div className="h-4 bg-zinc-800/60 w-44 rounded-sm" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-red-950/20 via-red-950/5 to-transparent" />
            <div className="h-3.5 bg-zinc-800/50 w-14 rounded-sm" />
          </div>

          {/* Cards Grid */}
          <div className="relative w-full flex flex-wrap justify-center items-start gap-6 sm:gap-8 lg:gap-10">
            {Array.from({ length: dept.count }).map((_, i) => (
              <ProfileCardSkeleton key={i} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
