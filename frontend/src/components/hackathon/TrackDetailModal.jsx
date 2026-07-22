import React from 'react';
import { X, ShieldAlert, Cpu, Database, Lock, Code2, Terminal, Binary, TerminalSquare, AlertTriangle } from 'lucide-react';

const trackDetailRegistry = {
  'FILE-01': {
    objective: 'Create resilient, secure educational platforms that bypass traditional infrastructure, ensuring access to quality instruction in low-bandwidth, remote, or hostile network topologies.',
    focusAreas: [
      'P2P Offline Sync: Sync student profiles and offline coursework directly over local device clusters.',
      'Low-Bandwidth Channels: Optimization algorithms to scale video lectures down to ultra-compact binary streams.',
      'Resilient Systems: Open-source portals built on decentralized hosting that withstand server crashes.',
    ],
    techStack: ['React', 'WebRTC', 'Service Workers', 'P2P protocols', 'TailwindCSS'],
  },
  'FILE-02': {
    objective: 'Implement public wellness early-warning anomaly trackers and real-time medical telemetry dashboards that protect data privacy while scaling accessibility.',
    focusAreas: [
      'Encrypted Health Streams: Secure end-to-end encrypted telemetry channels between smart medical sensors and dashboards.',
      'Outbreak Predictive AI: Real-time telemetry monitoring to identify anomalous spreads and trigger localized alarms.',
      'Emergency Coordination: Decentralized emergency communication meshes during natural or cyber disasters.',
    ],
    techStack: ['Node.js', 'WebSockets', 'TimeSeries DB', 'AES-256 Encryption', 'Chart.js'],
  },
  'FILE-03': {
    objective: 'Develop precision sustainability indices and IoT sensor grids designed to minimize ecological footprints and optimize resource allocation.',
    focusAreas: [
      'Real-time Eco Telemetry: Carbon calculation dashboards integrating smart energy consumption metrics.',
      'Smart Grid Automation: Microservice systems routing green energy based on local consumption trends.',
      'Autonomous Waste Networks: Sensor coordination grids tracking and optimizing solid waste disposal pathways.',
    ],
    techStack: ['GIS Mapping API', 'IoT Webhooks', 'Python Flask', 'Redis Cache', 'PostgreSQL'],
  },
  'FILE-04': {
    objective: 'Architect bulletproof transactional ledgers, secure peer-to-peer payout flows, and AI-powered threat detectors to defend user capital.',
    focusAreas: [
      'Fraud Telemetry Analysis: High-speed request analysis systems to catch micro-transaction spoofing.',
      'Decentralized Ledgers: Audit trails proving systemic integrity without sacrificing execution latency.',
      'Encrypted Digital Payouts: Zero-trust payment pipelines with integrated hardware wallet verification.',
    ],
    techStack: ['Solidity', 'Web3.js', 'Ethers.js', 'Cryptography/SHA3', 'Go-Micro'],
  },
  'FILE-05': {
    objective: 'Construct next-gen authentication meshes, intrusion detection relays, and decentralized identity profiles to repel modern threat actors.',
    focusAreas: [
      'Zero-Knowledge Authentication: User profile validation without transmitting raw passwords or hashes.',
      'Threat Intrusions Dashboard: Real-time traffic analysis maps locating and flags coordinate DDoS patterns.',
      'Decentralized SSO Profiles: Cryptographic key vaults allowing unified, tracking-resistant user profiles.',
    ],
    techStack: ['OAuth 2.1', 'JWT / Auth0', 'Rust Actix', 'Nginx logs', 'Docker / K8s'],
  },
  'FILE-06': {
    objective: 'Deploy ground-level intelligence, autonomous weather coordination matrices, and transparent supply-chain verifiers.',
    focusAreas: [
      'Soil Quality Telemetry: Real-time sensor processing pipelines generating irrigation warning alerts.',
      'Transparent Crop Audits: Immutable supply-chain registries tracking goods from farm-to-shelf.',
      'Predictive Harvesting Model: ML-based forecasting analyzing local soil telemetry history.',
    ],
    techStack: ['PyTorch / ML', 'WebGL Graphs', 'MQTT Protocol', 'SQLite', 'Docker'],
  },
  'FILE-07': {
    objective: 'Identify a systemic failure, trace the exploit route, and engineer a radical solution that pushes the boundaries of technology.',
    focusAreas: [
      'Cross-Domain Synthesis: Merging AI, cybersecurity, and WebGL visualizations to solve complex workflows.',
      'Disruptive Innovation: High-fidelity prototypes targeting newly emerged real-world problems.',
      'Open Architecture: Modular frameworks allowing anyone to fork and build upon the prototype.',
    ],
    techStack: ['React', 'Node.js', 'TailwindCSS', 'AI APIs', 'Custom Webhooks'],
  },
};

export default function TrackDetailModal({ track, onClose }) {
  const details = trackDetailRegistry[track.code] || {
    objective: 'Under investigation. Classified details require immediate solution.',
    focusAreas: ['Under investigation.'],
    techStack: ['React', 'Node.js'],
  };

  const getTrackIcon = (code) => {
    switch (code) {
      case 'FILE-01': return <Terminal className="w-8 h-8 text-red-500" />;
      case 'FILE-02': return <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />;
      case 'FILE-03': return <Cpu className="w-8 h-8 text-red-500" />;
      case 'FILE-04': return <Database className="w-8 h-8 text-red-500" />;
      case 'FILE-05': return <Lock className="w-8 h-8 text-red-500" />;
      case 'FILE-06': return <Code2 className="w-8 h-8 text-red-500" />;
      default: return <Binary className="w-8 h-8 text-red-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      {/* Glow Backdrop Accent */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.1)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-2xl bg-zinc-950 border border-red-500/40 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.25)] flex flex-col max-h-[90vh]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between bg-zinc-900 border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            {getTrackIcon(track.code)}
            <div>
              <span className="font-mono text-xs text-red-500 font-bold uppercase tracking-wider">{track.code}</span>
              <h3 className="font-display text-xl text-paper uppercase tracking-wider mt-0.5">{track.name}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors border border-white/5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Forensic Objective */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-red-500 uppercase tracking-widest">
              <TerminalSquare size={14} />
              <span>FORENSIC OBJECTIVE</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans bg-red-950/10 border border-red-500/10 p-4 rounded-md">
              {details.objective}
            </p>
          </div>

          {/* Investigation Focus Areas */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs text-red-500 uppercase tracking-widest">
              <AlertTriangle size={14} />
              <span>INVESTIGATION FOCUS AREAS</span>
            </div>
            <ul className="space-y-3 font-sans text-sm text-zinc-400">
              {details.focusAreas.map((area, idx) => {
                const parts = area.split(':');
                return (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="font-mono text-red-500 mt-0.5">{idx + 1}.</span>
                    <span>
                      <strong className="text-zinc-200">{parts[0]}</strong>{parts[1] && `:${parts[1]}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Tech Stack Chips */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs text-red-500 uppercase tracking-widest">
              <Binary size={14} />
              <span>APPROVED FORENSIC TOOLSTACK</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {details.techStack.map((tech) => (
                <span 
                  key={tech} 
                  className="font-mono text-xs px-3 py-1 rounded bg-zinc-900 border border-white/5 text-zinc-300 uppercase tracking-wider"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="bg-zinc-900 border-t border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
            STATUS: CASE DECRYPTED // AUTHORIZED
          </div>
          <button 
            onClick={onClose}
            className="font-mono text-xs px-4 py-2 border border-red-500/40 text-red-500 hover:bg-red-500/10 active:scale-95 transition-all uppercase tracking-wider"
          >
            [ DISMISS FILE ]
          </button>
        </div>
      </div>
    </div>
  );
}
