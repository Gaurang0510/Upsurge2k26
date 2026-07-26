import React from 'react';
import { Terminal, Cpu, Database, Lock, Binary, Eye, Globe, Sparkles, HeartPulse, Sprout } from 'lucide-react';

export default function TrackCard({ track, onAccess }) {
  // Map icons based on domain or fallback to code
  const getTrackIcon = (domain) => {
    switch (domain?.toLowerCase()) {
      case 'education': return <Terminal className="w-5 h-5 text-red-500 shrink-0" />;
      case 'healthcare': return <HeartPulse className="w-5 h-5 text-red-500 animate-pulse shrink-0" />;
      case 'agriculture': return <Sprout className="w-5 h-5 text-red-500 shrink-0" />;
      case 'web 3.0': return <Cpu className="w-5 h-5 text-red-500 shrink-0" />;
      case 'fintech': return <Database className="w-5 h-5 text-red-500 shrink-0" />;
      case 'cybersecurity': return <Lock className="w-5 h-5 text-red-500 shrink-0" />;
      case 'environment': return <Globe className="w-5 h-5 text-red-500 shrink-0" />;
      case 'open innovation': return <Sparkles className="w-5 h-5 text-red-500 animate-bounce shrink-0" />;
      default: return <Binary className="w-5 h-5 text-red-500 shrink-0" />;
    }
  };

  return (
    <article 
      onClick={() => onAccess && onAccess(track)}
      className="hackathon-track-card relative group overflow-hidden border border-red-500/20 bg-black/70 backdrop-blur-xl p-4 sm:p-6 transition-all duration-300 hover:border-red-500/60 hover:shadow-[0_0_35px_rgba(239,68,68,0.2)] rounded-xl flex flex-col justify-between h-full min-h-[290px] w-full max-w-full min-w-0 cursor-pointer"
    >
      {/* Corner Clip Decoration */}
      <div 
        className="absolute top-0 right-0 w-8 h-8 bg-red-600/10 border-l border-b border-red-500/20 group-hover:bg-red-500/20 group-hover:border-red-500 transition-all duration-300 pointer-events-none" 
        style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} 
      />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity" />

      <div className="w-full min-w-0 max-w-full overflow-hidden">
        {/* Cyber Header bar */}
        <div className="flex items-center justify-between gap-2 mb-4 border-b border-white/10 pb-3 w-full min-w-0 max-w-full">
          <div className="flex items-center gap-2 min-w-0 shrink">
            {getTrackIcon(track.domain)}
            <span className="font-mono text-xs tracking-wider uppercase text-red-500 font-bold truncate min-w-0">
              {track.psCode || track.code}
            </span>
          </div>
          <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider bg-zinc-900 border border-white/10 px-2 py-0.5 rounded shrink-0">
            {track.domain}
          </span>
        </div>

        {/* Track Title */}
        <h4 className="font-display text-base sm:text-lg md:text-xl font-bold tracking-wide text-white group-hover:text-red-400 transition-colors duration-300 mt-1 line-clamp-2 leading-snug break-words [overflow-wrap:anywhere] [word-break:break-word] w-full min-w-0">
          {track.name}
        </h4>

        {/* SDGs Badge */}
        {track.sdgs && (
          <div className="mt-2 text-[11px] font-mono text-zinc-400 flex items-center gap-1 min-w-0 max-w-full overflow-hidden">
            <span className="text-red-500 font-bold shrink-0">SDG:</span>
            <span className="truncate min-w-0 flex-1">{track.sdgs}</span>
          </div>
        )}

        {/* Track Brief Description */}
        <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans line-clamp-3 break-words [overflow-wrap:anywhere] [word-break:break-word] w-full min-w-0">
          {track.brief || track.problem}
        </p>
      </div>

      {/* Cyber Button footer */}
      <div className="mt-5 flex justify-between items-center border-t border-white/10 pt-3.5 text-xs font-mono w-full min-w-0 max-w-full gap-2">
        <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-wider text-[10px] truncate min-w-0 flex-1">
          CASE FILE // DECRYPT
        </span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAccess && onAccess(track);
          }}
          className="flex items-center gap-1.5 text-red-500 hover:text-red-400 font-bold group-hover:translate-x-1 transition-all uppercase text-xs shrink-0"
        >
          <span>VIEW DETAILS</span>
          <Eye size={14} />
        </button>
      </div>
    </article>
  );
}
