import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollFade from '../common/ScrollFade.jsx';

/* ═══════════════════ TIMELINE EVENT DATA — 3 DAYS ═══════════════════ */
const TIMELINE_EVENTS = [
  // ── DAY 1 ──
  {
    id: 'd1-01', caseNo: 'EVID-001', day: 'Day 1', time: '09:00',
    title: 'GATES OPEN & INTEL BRIEFING',
    status: 'OPERATIONAL', statusColor: '#22c55e', pinColor: '#22c55e',
    stickyColor: 'yellow', suspectLabel: 'AGENT CHECK-IN',
    stickyLines: ['STATUS: ASSEMBLED', 'SPOTTED: MAIN GATE'],
    description: 'Agents assemble at HQ. Badges, security clearances, and encrypted case files are distributed.',
    icon: '🏢', linkedEvent: null,
  },
  {
    id: 'd1-02', caseNo: 'EVID-002', day: 'Day 1', time: '10:00',
    title: 'OPENING CEREMONY',
    status: 'LIVE', statusColor: '#ef4444', pinColor: '#ef4444',
    stickyColor: 'pink', suspectLabel: 'ALL AGENTS',
    stickyLines: ['KEYNOTE: DELIVERED', 'MISSION: BRIEFED'],
    description: 'The investigation officially begins. Chief officers address all agents and declare the case open.',
    icon: '🎤', linkedEvent: null,
  },
  {
    id: 'd1-03', caseNo: 'EVID-003', day: 'Day 1', time: '11:00',
    title: 'OPERATION BREACH — KICKOFF',
    status: 'ACTIVE BREACH', statusColor: '#ef4444', pinColor: '#ef4444',
    stickyColor: 'pink', suspectLabel: 'SUSPECT 01',
    stickyLines: ['CODING: 24 HOURS', 'STATUS: NON-STOP'],
    description: 'The primary breach vector opens. Teams deploy prototypes under constant surveillance.',
    icon: '⚡', linkedEvent: '/hackathon',
  },
  {
    id: 'd1-04', caseNo: 'EVID-004', day: 'Day 1', time: '14:00',
    title: 'CAPTURE THE FLAG',
    status: 'SURVEILLANCE', statusColor: '#f59e0b', pinColor: '#f59e0b',
    stickyColor: 'yellow', suspectLabel: 'SUSPECT 02',
    stickyLines: ['FLAGS: ENCRYPTED', 'ZONE: SERVER ROOM'],
    description: 'Ethical hackers deploy payloads to uncover hidden security flags across classified servers.',
    icon: '🚩', linkedEvent: '/events',
  },
  {
    id: 'd1-05', caseNo: 'EVID-005', day: 'Day 1', time: '16:00',
    title: 'LOCKDOWN',
    status: 'RESTRICTED', statusColor: '#06b6d4', pinColor: '#06b6d4',
    stickyColor: 'pink', suspectLabel: 'SUSPECT 03',
    stickyLines: ['SECTOR: SEALED', 'ACCESS: DENIED'],
    description: 'High-security zones lock down. Teams must navigate constraints to solve under pressure.',
    icon: '🔒', linkedEvent: '/events',
  },
  {
    id: 'd1-06', caseNo: 'EVID-006', day: 'Day 1', time: '17:30',
    title: 'CIPHER HEIST & TURF WARS',
    status: 'ANALYZING', statusColor: '#a855f7', pinColor: '#a855f7',
    stickyColor: 'yellow', suspectLabel: 'SUSPECT 04',
    stickyLines: ['ARENA: LOCKED', 'SECTOR: NORTH LAB'],
    description: 'Cryptographic puzzles unravel as syndicates fight for dominance in tactical arenas.',
    icon: '🔐', linkedEvent: '/events',
  },

  // ── DAY 2 ──
  {
    id: 'd2-01', caseNo: 'EVID-007', day: 'Day 2', time: '09:00',
    title: 'OPERATION BREACH — CONTINUES',
    status: 'ACTIVE BREACH', statusColor: '#ef4444', pinColor: '#ef4444',
    stickyColor: 'pink', suspectLabel: 'ALL TEAMS',
    stickyLines: ['HOUR: 22 OF 24', 'INTENSITY: MAXIMUM'],
    description: 'The hackathon enters its final stretch. Teams push final commits and polish prototypes.',
    icon: '💻', linkedEvent: '/hackathon',
  },
  {
    id: 'd2-02', caseNo: 'EVID-008', day: 'Day 2', time: '11:00',
    title: 'SUBMISSIONS CLOSE',
    status: 'DEADLINE', statusColor: '#f59e0b', pinColor: '#f59e0b',
    stickyColor: 'yellow', suspectLabel: 'CODE FREEZE',
    stickyLines: ['REPOS: LOCKED', 'COMMITS: FINAL'],
    description: 'All code repositories are frozen. No more commits allowed. The evidence is sealed.',
    icon: '🧊', linkedEvent: '/hackathon',
  },
  {
    id: 'd2-03', caseNo: 'EVID-009', day: 'Day 2', time: '12:00',
    title: 'THE INVESTIGATION',
    status: 'INTERROGATION', statusColor: '#a855f7', pinColor: '#a855f7',
    stickyColor: 'pink', suspectLabel: 'SUSPECT 05',
    stickyLines: ['JURY: SENIOR AGENTS', 'METHOD: CROSS-EXAM'],
    description: 'The interrogation room opens. Projects face rigorous evaluation by senior investigators.',
    icon: '🔎', linkedEvent: '/events',
  },
  {
    id: 'd2-04', caseNo: 'EVID-010', day: 'Day 2', time: '14:00',
    title: 'SYNDICATE PITCH — FINALS',
    status: 'PRESENTING', statusColor: '#06b6d4', pinColor: '#06b6d4',
    stickyColor: 'yellow', suspectLabel: 'TOP SYNDICATES',
    stickyLines: ['PITCH: 10 MIN EACH', 'STAKES: MAXIMUM'],
    description: 'Shortlisted syndicates present their final pitch to the grand jury. High stakes, zero margin.',
    icon: '🎯', linkedEvent: '/events',
  },
  {
    id: 'd2-05', caseNo: 'EVID-011', day: 'Day 2', time: '15:30',
    title: 'EVIDENCE LOCKER — SHOWCASE',
    status: 'ON DISPLAY', statusColor: '#22c55e', pinColor: '#22c55e',
    stickyColor: 'pink', suspectLabel: 'ALL PROJECTS',
    stickyLines: ['EXPO: OPEN', 'VISITORS: WELCOME'],
    description: 'All project evidence is displayed for public viewing. Attendees explore every build and prototype.',
    icon: '🗄️', linkedEvent: '/events',
  },
  {
    id: 'd2-06', caseNo: 'EVID-012', day: 'Day 2', time: '17:00',
    title: 'CAGE MATCH — FINALS',
    status: 'COMBAT', statusColor: '#ef4444', pinColor: '#ef4444',
    stickyColor: 'yellow', suspectLabel: 'FINALISTS',
    stickyLines: ['FORMAT: ELIMINATION', 'ROUND: FINAL'],
    description: 'The ultimate head-to-head showdown. Finalists battle in a rapid-fire elimination round.',
    icon: '⚔️', linkedEvent: '/events',
  },

  // ── DAY 3 ──
  {
    id: 'd3-01', caseNo: 'EVID-013', day: 'Day 3', time: '09:00',
    title: 'THE GETAWAY & MANHUNT',
    status: 'IN PURSUIT', statusColor: '#f59e0b', pinColor: '#f59e0b',
    stickyColor: 'yellow', suspectLabel: 'FIELD AGENTS',
    stickyLines: ['TERRAIN: OUTDOOR', 'STATUS: ON THE RUN'],
    description: 'Physical and strategic outdoor events. Agents must pursue, strategize, and survive the manhunt.',
    icon: '🏃', linkedEvent: '/events',
  },
  {
    id: 'd3-02', caseNo: 'EVID-014', day: 'Day 3', time: '11:00',
    title: 'THE CHASE',
    status: 'HIGH SPEED', statusColor: '#06b6d4', pinColor: '#06b6d4',
    stickyColor: 'pink', suspectLabel: 'PURSUIT TEAMS',
    stickyLines: ['SPEED: MAXIMUM', 'COURSE: MAPPED'],
    description: 'A high-intensity relay challenge across the campus. Speed, coordination, and team sync required.',
    icon: '🏎️', linkedEvent: '/events',
  },
  {
    id: 'd3-03', caseNo: 'EVID-015', day: 'Day 3', time: '13:00',
    title: 'UNDERGROUND CIRCUIT',
    status: 'COVERT OPS', statusColor: '#a855f7', pinColor: '#a855f7',
    stickyColor: 'yellow', suspectLabel: 'DEEP COVER',
    stickyLines: ['ACCESS: RESTRICTED', 'INTEL: CLASSIFIED'],
    description: 'A hidden layer of challenges only the most observant agents can access and complete.',
    icon: '🕳️', linkedEvent: '/events',
  },
  {
    id: 'd3-04', caseNo: 'EVID-016', day: 'Day 3', time: '14:30',
    title: 'JURY DELIBERATION',
    status: 'DELIBERATING', statusColor: '#f59e0b', pinColor: '#f59e0b',
    stickyColor: 'pink', suspectLabel: 'SENIOR JURY',
    stickyLines: ['SCORES: COMPILED', 'VERDICT: IMMINENT'],
    description: 'The grand jury deliberates behind closed doors. Final scores are tallied across all events.',
    icon: '⚖️', linkedEvent: null,
  },
  {
    id: 'd3-05', caseNo: 'EVID-017', day: 'Day 3', time: '16:00',
    title: 'CLOSING CEREMONY',
    status: 'FINAL ACT', statusColor: '#ef4444', pinColor: '#ef4444',
    stickyColor: 'yellow', suspectLabel: 'ALL HANDS',
    stickyLines: ['SPEECHES: FINAL', 'FAREWELL: DELIVERED'],
    description: 'The final gathering. Highlights, thank-yous, and the official closing of UPSURGE 2K26.',
    icon: '🎙️', linkedEvent: null,
  },
  {
    id: 'd3-06', caseNo: 'EVID-018', day: 'Day 3', time: '17:00',
    title: 'CASE CLOSED — BOUNTY DISTRIBUTION',
    status: 'RESOLVED', statusColor: '#22c55e', pinColor: '#22c55e',
    stickyColor: 'pink', suspectLabel: 'VICTORIOUS',
    stickyLines: ['BOUNTY: CLAIMED', 'STATUS: DECLASSIFIED'],
    description: 'The masterminds are unmasked. Trophies, cash bounties, and certificates are awarded to the best.',
    icon: '🏆', linkedEvent: '/schedule',
  },
];

const DAYS = ['Day 1', 'Day 2', 'Day 3'];

/* ─────────────────── ANIMATED TYPEWRITER HEADER ─────────────────── */
function TypewriterText({ text, className }) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    setDisplayed('');
    setIsDone(false);
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setIsDone(true);
      }
    }, 55);
    return () => clearInterval(timer);
  }, [inView, text]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      {!isDone && <span className="animate-blink text-evidence">█</span>}
    </span>
  );
}

/* ─────────────────── SINGLE EVIDENCE CARD ─────────────────── */
function EvidenceCard({ item, index, isHovered, onHover, onLeave, onClick }) {
  const isEven = index % 2 === 0;
  const stickyBg = item.stickyColor === 'yellow'
    ? 'bg-[#ffe066] text-zinc-900'
    : 'bg-[#ff2a6d] text-white';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`group relative cursor-pointer transition-all duration-300 ease-out hover:-translate-y-3 hover:z-40 ${isEven ? 'lg:mt-0' : 'lg:mt-14'}`}
    >
      {/* ── Pushpin ── */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30">
        <div
          className="w-6 h-6 rounded-full shadow-[0_3px_12px_rgba(0,0,0,0.7)] border-2 border-white/60 flex items-center justify-center transition-transform duration-300 group-hover:scale-125"
          style={{ backgroundColor: item.pinColor }}
        >
          <div className="w-2 h-2 rounded-full bg-white/80" />
        </div>
      </div>

      {/* ── Card Frame ── */}
      <div className={`relative bg-zinc-100 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-zinc-300 overflow-visible transition-all duration-300 ease-out
        ${isEven ? '-rotate-1' : 'rotate-1'} 
        group-hover:rotate-0 group-hover:scale-[1.04] group-hover:shadow-[0_30px_70px_rgba(193,18,31,0.4)]`}
      >
        {/* Tape pieces */}
        <div className="absolute -top-2.5 left-5 w-14 h-3.5 bg-amber-200/60 border border-amber-400/40 -rotate-3 z-10 pointer-events-none" />
        <div className="absolute -top-2 right-4 w-10 h-3 bg-amber-200/40 border border-amber-400/30 rotate-6 z-10 pointer-events-none" />

        {/* ── Dark Photo Window ── */}
        <div className="relative h-28 sm:h-32 bg-[#0a0a0f] m-2.5 mb-0 overflow-hidden">
          {/* Ambient glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full blur-2xl opacity-25 transition-opacity duration-300 group-hover:opacity-55"
            style={{ backgroundColor: item.pinColor }}
          />

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between p-2.5">
            <span className="font-mono text-[10px] text-zinc-400 tracking-wider font-bold">{item.caseNo}</span>
            <span
              className="px-2 py-0.5 text-[8px] font-mono font-bold tracking-widest uppercase rounded-sm border"
              style={{
                color: item.statusColor,
                borderColor: item.statusColor + '66',
                backgroundColor: item.statusColor + '1a',
              }}
            >
              {item.status}
            </span>
          </div>

          {/* Icon + time */}
          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-end gap-2">
            <span className="text-2xl drop-shadow-lg">{item.icon}</span>
            <div>
              <p className="font-mono text-lg font-black text-white/90 leading-none">{item.time}</p>
              <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-[0.2em] mt-0.5">{item.day}</p>
            </div>
          </div>

          {/* Fingerprint watermark */}
          <svg className="absolute right-2 bottom-2 w-8 h-8 opacity-10 z-0" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="0.8">
            <circle cx="20" cy="20" r="18" /><circle cx="20" cy="20" r="14" /><circle cx="20" cy="20" r="10" /><circle cx="20" cy="20" r="6" />
          </svg>
        </div>

        {/* ── Caption ── */}
        <div className="p-2.5 pt-2">
          <h4 className="font-display text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-zinc-900 leading-tight group-hover:text-rose-700 transition-colors duration-300">
            {item.title}
          </h4>
          <p className="font-mono text-[9px] text-zinc-500 mt-1 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* ── Sticky Note ── */}
        <div
          className={`absolute -bottom-3.5 ${isEven ? '-right-2.5' : '-left-2.5'} w-[6.5rem] p-1.5 shadow-md border border-black/10 z-20
            ${stickyBg} ${isEven ? 'rotate-3' : '-rotate-3'}
            transition-transform duration-300 group-hover:scale-110 group-hover:rotate-0`}
        >
          <p className="font-mono font-extrabold text-[7px] tracking-wider uppercase border-b border-black/15 pb-0.5 mb-0.5">
            {item.suspectLabel}
          </p>
          {item.stickyLines.map((line, li) => (
            <p key={li} className="font-mono font-bold text-[7px] uppercase leading-tight tracking-tight">{line}</p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────── SVG THREAD LAYER ─────────────────── */
function ThreadLayer({ nodeCount, hoveredNode }) {
  // Build a 3-column × N-row grid of pin positions
  const cols = 3;
  const rows = Math.ceil(nodeCount / cols);
  const pinPositions = [];

  for (let i = 0; i < nodeCount; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    pinPositions.push({
      x: 16.67 + col * 33.33,
      y: (100 / (rows + 1)) * (row + 1),
    });
  }

  // Build sequential thread connections + a few cross threads
  const connections = [];
  for (let i = 0; i < nodeCount - 1; i++) {
    connections.push([i, i + 1]); // sequential
  }
  // Add diagonal cross-threads for visual interest
  for (let i = 0; i < nodeCount - 3; i += 2) {
    connections.push([i, i + 3]);
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="neonThread" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="0.6" result="blur1" />
          <feGaussianBlur stdDeviation="1.2" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="neonThreadHot" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="b1" />
          <feGaussianBlur stdDeviation="2" result="b2" />
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {connections.map(([a, b], i) => {
        if (a >= nodeCount || b >= nodeCount) return null;
        const start = pinPositions[a];
        const end = pinPositions[b];
        if (!start || !end) return null;
        const isActive = hoveredNode === a || hoveredNode === b;

        const mx = (start.x + end.x) / 2;
        const my = (start.y + end.y) / 2 + (i % 2 === 0 ? 3 : -2);
        const d = `M ${start.x} ${start.y} Q ${mx} ${my} ${end.x} ${end.y}`;

        return (
          <g key={`thread-${i}`}>
            <path d={d} fill="none" stroke="#000" strokeWidth={isActive ? '0.8' : '0.4'} strokeOpacity="0.5" />
            <path
              d={d} fill="none"
              stroke={isActive ? '#ff1744' : '#c1121f'}
              strokeWidth={isActive ? '0.6' : '0.3'}
              filter={isActive ? 'url(#neonThreadHot)' : 'url(#neonThread)'}
              className="transition-all duration-300"
            />
            <path d={d} fill="none" stroke={isActive ? '#ff5252' : '#e53935'} strokeWidth={isActive ? '0.3' : '0.15'} className="transition-all duration-300" />
            <path d={d} fill="none" stroke="#ffcdd2" strokeWidth="0.05" strokeOpacity="0.6" />
          </g>
        );
      })}

      {pinPositions.map((pos, idx) => (
        <g key={`pin-anchor-${idx}`}>
          <circle cx={pos.x} cy={pos.y} r={hoveredNode === idx ? '1.5' : '0.9'} fill="#ff1744" fillOpacity="0.6" filter="url(#neonThread)" />
          <circle cx={pos.x} cy={pos.y} r="0.35" fill="#fff" fillOpacity="0.9" />
        </g>
      ))}
    </svg>
  );
}

/* ─────────────────── MOBILE TIMELINE CARD ─────────────────── */
function MobileTimelineCard({ item, index, allEvents, onClick }) {
  const stickyBg = item.stickyColor === 'yellow'
    ? 'bg-[#ffe066] text-zinc-900'
    : 'bg-[#ff2a6d] text-white';

  const isFirstOfDay = index === 0 || item.day !== allEvents[index - 1]?.day;

  return (
    <motion.div
      initial={{ opacity: 0, x: -15, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* Pin */}
      <div className="absolute -left-[29px] top-5 z-20">
        <div
          className="w-4 h-4 rounded-full border-2 border-white/80 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          style={{ backgroundColor: item.pinColor }}
        />
      </div>

      {/* Day marker */}
      {isFirstOfDay && (
        <div className="absolute -left-[56px] -top-7 font-mono text-[9px] tracking-widest text-rose-400 font-bold uppercase whitespace-nowrap">
          {item.day}
        </div>
      )}

      <div className="bg-[#0d0d14] border border-white/10 rounded-xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md active:scale-[0.98] transition-all duration-200 hover:border-rose-600/30">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{item.icon}</span>
            <span className="font-mono text-xs font-bold text-rose-400">{item.caseNo}</span>
          </div>
          <span
            className="px-2 py-0.5 text-[8px] font-mono font-bold tracking-widest border rounded-sm uppercase"
            style={{ color: item.statusColor, borderColor: item.statusColor + '55', backgroundColor: item.statusColor + '15' }}
          >
            {item.status}
          </span>
        </div>

        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-mono text-2xl font-black text-white/90 leading-none">{item.time}</span>
          <h4 className="font-display text-sm font-bold text-white uppercase leading-tight">{item.title}</h4>
        </div>

        <p className="text-zinc-400 text-xs leading-relaxed">{item.description}</p>

        <div className={`mt-3 inline-flex gap-2 items-center px-2.5 py-1.5 rounded text-[9px] font-mono font-bold uppercase ${stickyBg}`}>
          <span className="font-extrabold">{item.suspectLabel}:</span>
          <span>{item.stickyLines.join(' · ')}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
export default function InvestigationTimeline() {
  const [activeDay, setActiveDay] = useState('Day 1');
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);

  const filteredEvents = TIMELINE_EVENTS.filter(ev => ev.day === activeDay);

  return (
    <section className="relative bg-[#060608] py-20 sm:py-28 overflow-hidden border-y border-white/[0.06]">
      {/* ── Atmospheric layers ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(193,18,31,0.08),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1a1a28_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-[0.12] mix-blend-overlay pointer-events-none" />

      {/* Top hazard tape */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-tape opacity-70 z-20 pointer-events-none" />

      {/* Scanline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-evidence/[0.06] to-transparent animate-scanline z-10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">

        {/* ═══ SECTION HEADER ═══ */}
        <ScrollFade direction="up" className="mb-10 sm:mb-14">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-evidence/10 border border-evidence/25 rounded-sm mb-5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-evidence opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-evidence" />
                </span>
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-evidence font-bold">
                  Evidence File #UP-2K26
                </span>
              </div>

              <h2 className="heading-display text-3xl sm:text-4xl lg:text-5xl mb-3">
                <TypewriterText text="CASE TIMELINE" className="text-white" />
              </h2>
              <p className="text-steel text-sm sm:text-base leading-relaxed max-w-xl">
                Follow the red thread across 3 days of investigation. Each milestone is pinned to the board as the case unfolds.
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 self-start lg:self-end">
              {[
                { color: '#22c55e', label: 'Operational' },
                { color: '#ef4444', label: 'Active Breach' },
                { color: '#f59e0b', label: 'Surveillance' },
                { color: '#a855f7', label: 'Covert Ops' },
              ].map(({ color, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </ScrollFade>

        {/* ═══ DAY TABS ═══ */}
        <div className="flex items-center gap-2 mb-8">
          {DAYS.map((day, di) => {
            const dayEvents = TIMELINE_EVENTS.filter(ev => ev.day === day);
            const isActive = activeDay === day;
            return (
              <button
                key={day}
                onClick={() => { setActiveDay(day); setHoveredNode(null); }}
                className={`relative flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-mono text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 border ${
                  isActive
                    ? 'bg-evidence/15 border-evidence/50 text-white font-bold shadow-[0_0_20px_rgba(193,18,31,0.3)]'
                    : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.06] hover:border-white/20'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="dayIndicator"
                    className="absolute inset-0 rounded-xl bg-evidence/15 border border-evidence/50"
                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-evidence animate-pulse' : 'bg-zinc-600'}`} />
                  {day}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    isActive ? 'border-evidence/40 text-evidence' : 'border-zinc-700 text-zinc-500'
                  }`}>
                    {dayEvents.length}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* ═══ DESKTOP: EVIDENCE BOARD ═══ */}
        <div className="relative hidden lg:block">
          <div className="relative bg-[#0a0b10] border-2 border-zinc-800/70 rounded-2xl p-8 xl:p-10 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]">
            {/* Vignette */}
            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(193,18,31,0.04)_0%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

            {/* Chalk outline watermark */}
            <svg className="absolute right-8 top-8 w-24 h-36 opacity-[0.04] pointer-events-none" viewBox="0 0 60 90" fill="none" stroke="white" strokeWidth="1.5">
              <circle cx="30" cy="12" r="10" />
              <path d="M30 22 V58 M30 32 L12 48 M30 32 L48 44 M30 58 L18 85 M30 58 L42 85" />
            </svg>

            {/* CLASSIFIED stamp */}
            <div className="absolute top-5 right-8 rotate-[14deg] border-2 border-evidence/25 px-4 py-1 pointer-events-none select-none">
              <span className="font-mono text-sm font-extrabold tracking-[0.3em] text-evidence/35 uppercase">Classified</span>
            </div>

            {/* Day label stamp */}
            <div className="absolute top-5 left-8 pointer-events-none select-none">
              <span className="font-mono text-lg font-extrabold tracking-[0.2em] text-evidence/20 uppercase">
                {activeDay} // {filteredEvents.length} Events
              </span>
            </div>

            {/* Thread SVG */}
            <div className="absolute inset-8 xl:inset-10 pointer-events-none z-[5]">
              <ThreadLayer nodeCount={filteredEvents.length} hoveredNode={hoveredNode} />
            </div>

            {/* Card Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 grid grid-cols-3 gap-7 xl:gap-10 pt-6"
              >
                {filteredEvents.map((item, index) => (
                  <EvidenceCard
                    key={item.id}
                    item={item}
                    index={index}
                    isHovered={hoveredNode === index}
                    onHover={() => setHoveredNode(index)}
                    onLeave={() => setHoveredNode(null)}
                    onClick={() => setSelectedCase(item)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Bottom tape */}
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-tape opacity-40 rounded-b-2xl pointer-events-none" />
          </div>

          {/* Corner tacks */}
          {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos) => (
            <div key={pos} className={`absolute ${pos} w-3 h-3 rounded-full bg-zinc-600 border border-zinc-500 shadow-md z-20`} />
          ))}
        </div>

        {/* ═══ MOBILE VERTICAL TIMELINE ═══ */}
        <div className="lg:hidden relative pl-8 sm:pl-10">
          {/* Glowing vertical line */}
          <div className="absolute left-[7px] sm:left-[9px] top-0 bottom-0 w-[3px]">
            <div className="absolute inset-0 bg-gradient-to-b from-evidence via-evidence/60 to-evidence/20 rounded-full" />
            <div className="absolute inset-0 bg-gradient-to-b from-evidence via-evidence/60 to-evidence/20 rounded-full blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-b from-evidence via-evidence/60 to-transparent rounded-full blur-md opacity-50" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-7"
            >
              {filteredEvents.map((item, index) => (
                <MobileTimelineCard
                  key={item.id}
                  item={item}
                  index={index}
                  allEvents={filteredEvents}
                  onClick={() => setSelectedCase(item)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ═══ FOOTER BAR ═══ */}
        <ScrollFade direction="up" delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 p-4 bg-black/50 border border-white/[0.08] rounded-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-wider">
              <span className="text-evidence">⬤</span>
              <span>{TIMELINE_EVENTS.length} Evidence Nodes</span>
              <span className="text-zinc-700">|</span>
              <span>3 Day Investigation</span>
              <span className="text-zinc-700">|</span>
              <span className="text-evidence/70">{activeDay}: {filteredEvents.length} Events</span>
            </div>
            <span className="font-mono text-[10px] sm:text-xs text-evidence/60 uppercase tracking-widest font-bold">
              [ Click any card to inspect ]
            </span>
          </div>
        </ScrollFade>
      </div>

      {/* ═══ CASE DOSSIER MODAL ═══ */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg"
            onClick={() => setSelectedCase(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-[#0d0d14] border border-white/10 rounded-2xl shadow-[0_0_80px_rgba(193,18,31,0.3)] overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-transparent via-evidence to-transparent" />

              <div className="absolute top-5 right-5 rotate-12 border-2 border-evidence/40 px-3 py-1 pointer-events-none select-none">
                <span className="font-mono font-extrabold text-[10px] tracking-[0.3em] text-evidence/60 uppercase">Verified</span>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-4xl">{selectedCase.icon}</span>
                  <div>
                    <p className="font-mono text-[10px] text-evidence font-bold tracking-[0.2em] uppercase">
                      {selectedCase.caseNo} — {selectedCase.day} / {selectedCase.time}
                    </p>
                    <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-white mt-0.5">{selectedCase.title}</h3>
                  </div>
                </div>

                <div className="p-3.5 bg-black/50 border border-white/[0.08] rounded-lg mb-4">
                  <p className="font-mono text-[10px] text-evidence font-bold tracking-widest uppercase mb-1.5">[ Case Summary ]</p>
                  <p className="text-zinc-300 text-sm leading-relaxed">{selectedCase.description}</p>
                </div>

                <div className={`p-3 rounded-lg text-xs font-mono font-bold mb-6 ${
                  selectedCase.stickyColor === 'yellow' ? 'bg-[#ffe066] text-zinc-900' : 'bg-[#ff2a6d] text-white'
                }`}>
                  <p className="text-[10px] uppercase border-b border-black/15 pb-1 mb-1.5 tracking-wider">{selectedCase.suspectLabel}</p>
                  {selectedCase.stickyLines.map((line, i) => (
                    <p key={i} className="uppercase tracking-tight">{line}</p>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="px-4 py-2 font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  >
                    Close
                  </button>
                  {selectedCase.linkedEvent && (
                    <Link
                      to={selectedCase.linkedEvent}
                      onClick={() => setSelectedCase(null)}
                      className="btn-primary"
                    >
                      View Full Case
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
