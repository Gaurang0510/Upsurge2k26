import { Marquee } from '../ui/marquee.jsx';
import ScrollFade from '../common/ScrollFade.jsx';
import SectionHeading from '../common/SectionHeading.jsx';
import {
  Shield,
  Cpu,
  Terminal,
  Globe,
  Database,
  Zap,
  Lock,
  Code2,
  Layers,
  Activity,
  Radar,
  Binary,
  Flame,
  Infinity,
  Box,
  Radio,
} from 'lucide-react';

// Sponsor logo collection with icons & brand colors
const sponsorLogos = [
  { name: 'NexaCorp', icon: Cpu, color: '#C1121F', tag: 'TITLE SPONSOR' },
  { name: 'VaultSec', icon: Shield, color: '#ef4444', tag: 'CYBER SECURITY' },
  { name: 'CyberShield', icon: Lock, color: '#f59e0b', tag: 'INFRASTRUCTURE' },
  { name: 'QuantumForge', icon: Binary, color: '#06b6d4', tag: 'QUANTUM LABS' },
  { name: 'IronGate', icon: Terminal, color: '#a855f7', tag: 'CLOUDFLARE SYSTEMS' },
  { name: 'DeepTrace AI', icon: Radar, color: '#22c55e', tag: 'AI & INTELLIGENCE' },
  { name: 'ByteHunter', icon: Code2, color: '#3b82f6', tag: 'DEV OPS' },
  { name: 'CodeVault', icon: Database, color: '#ec4899', tag: 'DATA PLATFORM' },
  { name: 'RedNode', icon: Zap, color: '#ff2a6d', tag: 'FAST COMPUTING' },
  { name: 'PhantomNet', icon: Globe, color: '#14b8a6', tag: 'GLOBAL MESH' },
  { name: 'Sentinel', icon: Layers, color: '#f97316', tag: 'ZERO TRUST' },
  { name: 'DataForge', icon: Activity, color: '#eab308', tag: 'TELEMETRY' },
  { name: 'Nexus Core', icon: Flame, color: '#ff4d4d', tag: 'HARDWARE' },
  { name: 'InfiniTech', icon: Infinity, color: '#00f2fe', tag: 'SYNAPSE' },
  { name: 'HyperBox', icon: Box, color: '#b92b27', tag: 'CONTAINERS' },
  { name: 'RadioWave', icon: Radio, color: '#10b981', tag: 'COMMUNICATIONS' },
];

function SponsorLogoCard({ name, icon: Icon, color, tag }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center w-48 h-36 sm:w-56 sm:h-40 lg:w-64 lg:h-44 rounded-2xl border border-white/10 bg-[#0c0d14] p-4 sm:p-5 transition-[transform,border-color,box-shadow] duration-300 hover:scale-[1.03] hover:border-evidence/60 hover:shadow-[0_0_35px_rgba(193,18,31,0.35)] group cursor-pointer will-change-transform transform-gpu"
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: color }}
      />

      {/* Decorative corner tacks */}
      <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-white/20 border border-white/10" />
      <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-white/20 border border-white/10" />

      {/* Sponsor Icon Box */}
      <div className="relative z-10 flex items-center justify-center p-3.5 sm:p-4.5 rounded-xl bg-black/70 border border-white/10 group-hover:border-white/30 transition-colors shadow-inner">
        <Icon className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]" style={{ color }} />
      </div>

      {/* Name & Tag */}
      <span className="relative z-10 font-mono text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-3 group-hover:text-rose-400 transition-colors">
        {name}
      </span>
      <span className="relative z-10 font-mono text-[8px] sm:text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5" style={{ color }}>
        {tag}
      </span>
    </div>
  );
}

export default function SponsorsMarquee() {
  // Distribute 16 logos across 3 lines
  const colSet1 = sponsorLogos.slice(0, 5);
  const colSet2 = sponsorLogos.slice(5, 11);
  const colSet3 = sponsorLogos.slice(11, 16);

  return (
    <section className="relative bg-case-black border-y border-white/5 py-24 sm:py-36 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(193,18,31,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-[0.12] mix-blend-overlay pointer-events-none" />

      {/* Header */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-20">
        <ScrollFade direction="up">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-evidence/10 border border-evidence/25 rounded-sm mb-4 mx-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-evidence opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-evidence" />
              </span>
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-evidence font-bold">
                Intelligence Partners
              </span>
            </div>
            <SectionHeading
              eyebrow="Backed by Industry Leaders"
              title="Official Sponsors"
              description="Powering the security infrastructure, bounties, and platforms of UPSURGE 2K26."
              align="center"
              scrollFloat={true}
            />
          </div>
        </ScrollFade>
      </div>

      {/* 3D Perspective Marquee Container with 3 Lines */}
      <div className="relative flex h-[550px] sm:h-[650px] lg:h-[720px] w-full flex-row items-center justify-center overflow-hidden [perspective:800px]">
        <div
          className="flex flex-row items-center gap-8 sm:gap-12 lg:gap-16 w-full justify-center will-change-transform transform-gpu z-20 [contain:layout_style_paint]"
          style={{
            transform: 'rotateX(14deg) rotateY(-5deg) rotateZ(10deg)',
          }}
        >
          {/* Line 1 — Moves DOWNWARD */}
          <Marquee
            vertical
            pauseOnHover
            repeat={4}
            style={{ '--duration': '25s', '--gap': '1.75rem' }}
            className="z-20"
          >
            {colSet1.map((s) => (
              <SponsorLogoCard key={s.name + '-line1'} {...s} />
            ))}
          </Marquee>

          {/* Line 2 — Moves UPWARD (Reverse direction) */}
          <Marquee
            vertical
            pauseOnHover
            reverse
            repeat={4}
            style={{ '--duration': '28s', '--gap': '1.75rem' }}
            className="z-20"
          >
            {colSet2.map((s) => (
              <SponsorLogoCard key={s.name + '-line2'} {...s} />
            ))}
          </Marquee>

          {/* Line 3 — Moves DOWNWARD */}
          <Marquee
            vertical
            pauseOnHover
            repeat={4}
            style={{ '--duration': '30s', '--gap': '1.75rem' }}
            className="z-20"
          >
            {colSet3.map((s) => (
              <SponsorLogoCard key={s.name + '-line3'} {...s} />
            ))}
          </Marquee>
        </div>

        {/* ── Top, Bottom, Left, Right Edge Gradient Fades ── */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-case-black via-case-black/90 to-transparent z-30" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-case-black via-case-black/90 to-transparent z-30" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-case-black via-case-black/90 to-transparent z-30" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-case-black via-case-black/90 to-transparent z-30" />

        {/* ── Corner Radial Vignettes for Smooth Radial Corner Fading ── */}
        <div className="pointer-events-none absolute top-0 left-0 w-80 h-80 bg-[radial-gradient(circle_at_top_left,rgba(5,5,5,1)_0%,rgba(5,5,5,0.85)_40%,transparent_100%)] z-30" />
        <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_top_right,rgba(5,5,5,1)_0%,rgba(5,5,5,0.85)_40%,transparent_100%)] z-30" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(circle_at_bottom_left,rgba(5,5,5,1)_0%,rgba(5,5,5,0.85)_40%,transparent_100%)] z-30" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_bottom_right,rgba(5,5,5,1)_0%,rgba(5,5,5,0.85)_40%,transparent_100%)] z-30" />
      </div>
    </section>
  );
}
