import { useState, useEffect } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import ChromaGrid from '../../components/team/ChromaGrid.jsx';
import Aurora from '../../components/team/Aurora.jsx';
import ScrollFade from '../../components/common/ScrollFade.jsx';
import TeamSkeleton from '../../components/team/TeamSkeleton.jsx';
import technicalTeam from '../../data/team/technical-team.js';

export default function Developers() {
  useDocumentTitle('Behind The Code');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const devNames = ['Gaurang Dhawale', 'Himesh Gaikwad', 'Shivprasad Harde', 'Prasanna Lohe'];
  const developersList = devNames
    .map(name => technicalTeam.find(m => m.name === name))
    .filter(Boolean);

  const cyberPalettes = [
    { borderColor: 'rgba(226, 55, 68, 0.7)', gradient: 'linear-gradient(145deg, rgba(226, 55, 68, 0.45) 0%, rgba(15, 18, 17, 0.95) 100%)' },
    { borderColor: 'rgba(139, 92, 246, 0.7)', gradient: 'linear-gradient(145deg, rgba(139, 92, 246, 0.45) 0%, rgba(15, 18, 17, 0.95) 100%)' },
    { borderColor: 'rgba(6, 182, 212, 0.7)', gradient: 'linear-gradient(145deg, rgba(6, 182, 212, 0.45) 0%, rgba(15, 18, 17, 0.95) 100%)' },
    { borderColor: 'rgba(16, 185, 129, 0.7)', gradient: 'linear-gradient(145deg, rgba(16, 185, 129, 0.45) 0%, rgba(15, 18, 17, 0.95) 100%)' }
  ];

  const formattedMembers = developersList.map((member, index) => {
    const palette = cyberPalettes[index % cyberPalettes.length];
    return {
      ...member,
      borderColor: palette.borderColor,
      gradient: palette.gradient,
      handle: `web_dev_${String(index + 1).padStart(2, '0')}`
    };
  });

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-case-black">
      {/* Top Aurora WebGL Layer */}
      <Aurora color="red" intensity={0.5} />

      <div className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8 relative z-10">
        {/* Page Header */}
        <ScrollFade direction="down">
          <SectionHeading
            title="BEHIND THE CODE"
            subtitle="web masters & developers"
            center={true}
          />
          <p className="mx-auto mt-6 max-w-2xl text-center font-display text-sm tracking-wide text-steel leading-relaxed">
            The core development crew responsible for designing, building, and deploying the official digital systems for UPSURGE 2K26.
          </p>
        </ScrollFade>

        {/* Members Grid */}
        <div className="mt-20">
          {isLoading ? (
            <TeamSkeleton />
          ) : (
            <div className="animate-[fade-up_0.6s_ease-out_both]">
              <section className="mb-20">
                <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <h3 className="font-mono text-xs uppercase tracking-widest text-red-500 font-bold">
                      // DIRECTORY: CORE DEVELOPERS
                    </h3>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-red-600/40 via-red-900/20 to-transparent" />
                  <span className="font-mono text-[10px] text-zinc-400 uppercase">
                    {developersList.length} UNITS
                  </span>
                </div>

                <ChromaGrid items={formattedMembers} radius={700} damping={0.4} />
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
