import React from 'react';
import { Terminal, ShieldAlert, Cpu, Eye, Binary, Database, Lock, Code2, Fingerprint } from 'lucide-react';

export default function TrackCard({ track, onAccess }) {
  // Map beautiful cyber-themed icons based on track code/category
  const getTrackIcon = (code) => {
    switch (code) {
      case 'FILE-01': return <Terminal className="w-5 h-5 text-red-500" />;
      case 'FILE-02': return <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />;
      case 'FILE-03': return <Cpu className="w-5 h-5 text-red-500" />;
      case 'FILE-04': return <Database className="w-5 h-5 text-red-500" />;
      case 'FILE-05': return <Lock className="w-5 h-5 text-red-500" />;
      case 'FILE-06': return <Code2 className="w-5 h-5 text-red-500" />;
      case 'FILE-08': return <Fingerprint className="w-5 h-5 text-red-500 animate-pulse" />;
      default: return <Binary className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <article 
      onClick={() => onAccess && onAccess(track)}
      className="hackathon-track-card relative group overflow-hidden border border-red-500/20 bg-black/60 backdrop-blur-xl p-6 transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] rounded-lg flex flex-col justify-between min-h-[290px] cursor-pointer"
    >
      {/* Corner Clip Decoration */}
      <div 
        className="absolute top-0 right-0 w-8 h-8 bg-red-600/10 border-l border-b border-red-500/20 group-hover:bg-red-500/20 group-hover:border-red-500 transition-all duration-300 pointer-events-none" 
        style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} 
      />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(239,68,68,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(239,68,68,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity" />

      <div>
        {/* Cyber Header bar */}
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            {getTrackIcon(track.code)}
            <span className="font-mono text-[10px] tracking-widest uppercase text-red-500 font-bold">{track.code} // {track.psCode}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>ENCRYPTED</span>
          </div>
        </div>

        {/* Track Title */}
        <h4 className="font-display text-2xl uppercase tracking-wide text-white group-hover:text-red-500 transition-colors duration-300 mt-2">
          {track.name}
        </h4>

        {/* Track Description */}
        <p className="mt-3 text-sm text-zinc-400 leading-relaxed font-sans">
          {track.brief}
        </p>

        {/* Code lines visual placeholder */}
        <div className="mt-4 flex gap-1 font-mono text-[8px] text-zinc-600">
          <span>[SYS_KEY: 0x{track.code.replace('-', '')}FA]</span>
          <span>{"//"}</span>
          <span>INDEX: ACTIVE</span>
        </div>
      </div>

      {/* Cyber Button footer */}
      <div className="mt-6 flex justify-between items-center border-t border-white/5 pt-4 text-xs font-mono">
        <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-wider text-[10px]">CASE OVERVIEW</span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAccess && onAccess(track);
          }}
          className="flex items-center gap-1 text-red-500 hover:text-red-400 group-hover:translate-x-1 transition-all"
        >
          <span>ACCESS FILE</span>
          <Eye size={12} />
        </button>
      </div>
    </article>
  );
}
