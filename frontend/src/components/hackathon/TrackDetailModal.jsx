import React, { useEffect } from 'react';
import { X, ShieldAlert, Cpu, Database, Lock, Terminal, Binary, AlertTriangle, Target, CheckCircle2, Globe, Sparkles } from 'lucide-react';

export default function TrackDetailModal({ track, onClose }) {
  useEffect(() => {
    // Add class to hide navbar when modal is open
    document.body.classList.add('hide-navbar');
    return () => {
      // Remove class when modal is closed
      document.body.classList.remove('hide-navbar');
    };
  }, []);

  if (!track) return null;

  const getTrackIcon = (domain) => {
    switch (domain?.toLowerCase()) {
      case 'education': return <Terminal className="w-7 h-7 text-red-500" />;
      case 'healthcare': return <HeartPulseIcon className="w-7 h-7 text-red-500 animate-pulse" />;
      case 'agriculture': return <SproutIcon className="w-7 h-7 text-red-500" />;
      case 'web 3.0': return <Cpu className="w-7 h-7 text-red-500" />;
      case 'fintech': return <Database className="w-7 h-7 text-red-500" />;
      case 'cybersecurity': return <Lock className="w-7 h-7 text-red-500" />;
      case 'environment': return <Globe className="w-7 h-7 text-red-500" />;
      case 'open innovation': return <Sparkles className="w-7 h-7 text-red-500 animate-bounce" />;
      default: return <Binary className="w-7 h-7 text-red-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Glow Backdrop Accent */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-3xl bg-zinc-950 border border-red-500/40 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.25)] flex flex-col max-h-[92vh] my-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between bg-zinc-900 border-b border-white/10 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3.5 pr-4">
            <div className="p-2 rounded-lg bg-red-950/40 border border-red-500/20 mt-0.5 flex-shrink-0">
              {getTrackIcon(track.domain)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-red-500 font-bold uppercase tracking-wider">{track.code}</span>
                <span className="text-zinc-600 font-mono text-xs">•</span>
                <span className="font-mono text-xs text-red-400 font-semibold bg-red-950/60 px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-wider">
                  {track.psCode}
                </span>
                <span className="text-zinc-600 font-mono text-xs">•</span>
                <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
                  Domain: <strong className="text-white">{track.domain}</strong>
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl text-paper tracking-wide mt-1.5 leading-snug">
                {track.name}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors border border-white/5 flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-zinc-300 custom-scrollbar">
          {/* SDGs Tag */}
          {track.sdgs && (
            <div className="flex items-center gap-2 font-mono text-xs bg-red-950/30 border border-red-500/20 px-3.5 py-2 rounded-md text-red-400">
              <Globe size={15} className="flex-shrink-0 text-red-500" />
              <span><strong className="text-white">Relevant SDGs:</strong> {track.sdgs}</span>
            </div>
          )}

          {/* Problem Statement */}
          {track.problem && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-red-500 uppercase tracking-widest font-bold">
                <ShieldAlert size={14} />
                <span>PROBLEM STATEMENT</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans bg-zinc-900/80 border border-white/5 p-4 rounded-lg">
                {track.problem}
              </p>
            </div>
          )}

          {/* Key Issues */}
          {track.keyIssues && track.keyIssues.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-red-500 uppercase tracking-widest font-bold">
                <AlertTriangle size={14} />
                <span>KEY ISSUES</span>
              </div>
              <ul className="space-y-2 font-sans text-sm text-zinc-300">
                {track.keyIssues.map((issue, idx) => (
                  <li key={idx} className="flex gap-3 items-start bg-zinc-900/40 p-2.5 rounded border border-white/5">
                    <span className="font-mono text-xs text-red-500 font-bold mt-0.5">[{idx + 1}]</span>
                    <span className="leading-normal">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Challenge Box */}
          {track.challenge && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-red-400 uppercase tracking-widest font-bold">
                <Target size={14} />
                <span>CHALLENGE</span>
              </div>
              <div className="text-sm text-zinc-200 leading-relaxed font-sans bg-gradient-to-r from-red-950/40 via-red-900/20 to-zinc-950 border border-red-500/30 p-4 rounded-lg shadow-inner">
                {track.challenge}
              </div>
            </div>
          )}

          {/* Deliverables */}
          {track.deliverables && track.deliverables.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-red-500 uppercase tracking-widest font-bold">
                <CheckCircle2 size={14} />
                <span>EXPECTED DELIVERABLES</span>
              </div>
              <div className="grid gap-2 font-sans text-sm">
                {track.deliverables.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start bg-zinc-900/60 p-3 rounded-lg border border-white/5">
                    <CheckCircle2 size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-300 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-zinc-900 border-t border-white/10 px-5 py-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            STATUS: CASE FILE DECRYPTED // DATA DECLASSIFIED
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="font-mono text-xs px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline fallback icons for specific domains
function HeartPulseIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
    </svg>
  );
}

function SproutIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 20h10"/>
      <path d="M10 20c5.5-2.5.8-6.4 3-10"/>
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-1.5-.4-3.2-.4-4.8.3-1.2.6-2.3 1.6-3 2.8 3-.4 6-2 5.5-6.8"/>
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.7-.6 5.2-1.7 1.2-.9 2-2.2 2.3-3.7-3.1.2-5.7 1.6-6.4 1.4"/>
    </svg>
  );
}

