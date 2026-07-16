import ChromaGrid from './ChromaGrid.jsx';

export default function TeamSection({ department }) {
  // Rich Cyber Crime color themes for ProfileCard inner gradients & behindGlow
  const cyberPalettes = [
    { borderColor: 'rgba(226, 55, 68, 0.7)', gradient: 'linear-gradient(145deg, rgba(226, 55, 68, 0.45) 0%, rgba(15, 18, 17, 0.95) 100%)' },
    { borderColor: 'rgba(139, 92, 246, 0.7)', gradient: 'linear-gradient(145deg, rgba(139, 92, 246, 0.45) 0%, rgba(15, 18, 17, 0.95) 100%)' },
    { borderColor: 'rgba(6, 182, 212, 0.7)', gradient: 'linear-gradient(145deg, rgba(6, 182, 212, 0.45) 0%, rgba(15, 18, 17, 0.95) 100%)' },
    { borderColor: 'rgba(16, 185, 129, 0.7)', gradient: 'linear-gradient(145deg, rgba(16, 185, 129, 0.45) 0%, rgba(15, 18, 17, 0.95) 100%)' },
    { borderColor: 'rgba(245, 158, 11, 0.7)', gradient: 'linear-gradient(145deg, rgba(245, 158, 11, 0.45) 0%, rgba(15, 18, 17, 0.95) 100%)' },
    { borderColor: 'rgba(236, 72, 153, 0.7)', gradient: 'linear-gradient(145deg, rgba(236, 72, 153, 0.45) 0%, rgba(15, 18, 17, 0.95) 100%)' }
  ];

  const formattedMembers = department.members.map((member, index) => {
    const palette = cyberPalettes[index % cyberPalettes.length];
    return {
      ...member,
      borderColor: palette.borderColor,
      gradient: palette.gradient,
      handle: `unit_${String(index + 1).padStart(2, '0')}`
    };
  });

  return (
    <section className="mb-20">
      <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <h3 className="font-mono text-xs uppercase tracking-widest text-red-500 font-bold">
            {`// DEPARTMENT: ${department.name}`}
          </h3>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-red-600/40 via-red-900/20 to-transparent" />
        <span className="font-mono text-[10px] text-zinc-400 uppercase">
          {department.members.length} UNITS
        </span>
      </div>

      <ChromaGrid items={formattedMembers} radius={700} damping={0.4} />
    </section>
  );
}

