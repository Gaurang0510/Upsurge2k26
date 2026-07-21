import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollFade from '../common/ScrollFade.jsx';
import SectionHeading from '../common/SectionHeading.jsx';
import { FileText, Download, Lock, ShieldAlert, Sparkles, ChevronRight, Eye, Flame } from 'lucide-react';

export default function CyberCoffinVault() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);

  // Handle opening state & auto-dissipate smoke after 4 seconds
  const handleToggleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      setShowSmoke(true);
    } else {
      setIsOpen(false);
      setShowSmoke(false);
    }
  };

  useEffect(() => {
    if (isOpen && showSmoke) {
      const timer = setTimeout(() => {
        setShowSmoke(false);
      }, 4200); // Dissipates after 4.2 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, showSmoke]);

  return (
    <section className="relative bg-case-black py-20 sm:py-28 overflow-hidden border-y border-white/5 select-none">
      
      {/* ── 1. PAGE-WIDE VOLUMETRIC SMOKE SPREAD OVERLAY (FADES OUT AFTER 4 SECONDS) ── */}
      <AnimatePresence>
        {showSmoke && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
          >
            {/* Fullscreen Rolling Fog Cloud 1 */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 100 }}
              animate={{ scale: 2.4, opacity: 0.65, y: -50, rotate: 10 }}
              exit={{ opacity: 0, scale: 3 }}
              transition={{ duration: 5, ease: 'easeInOut' }}
              className="absolute -inset-[50%] bg-[radial-gradient(circle_at_center,rgba(200,200,220,0.4)_0%,rgba(193,18,31,0.25)_40%,transparent_75%)] blur-[90px]"
            />
            {/* Fullscreen Rolling Fog Cloud 2 */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -50 }}
              animate={{ scale: 2.8, opacity: 0.5, y: 80, rotate: -15 }}
              exit={{ opacity: 0, scale: 3.5 }}
              transition={{ duration: 6, delay: 0.3, ease: 'easeInOut' }}
              className="absolute -inset-[50%] bg-[radial-gradient(circle_at_center,rgba(120,120,150,0.35)_0%,rgba(0,102,255,0.2)_45%,transparent_80%)] blur-[100px]"
            />
            {/* Dynamic Floating Ash & Smoke Particle Sparks across page */}
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={`screen-smoke-particle-${i}`}
                initial={{
                  opacity: 0,
                  y: '110vh',
                  x: `${(i * 4.2) % 100}vw`,
                  scale: 0.5 + Math.random(),
                }}
                animate={{
                  opacity: [0, 0.9, 0],
                  y: '-10vh',
                  x: `${((i * 4.2) % 100) + (i % 2 === 0 ? 15 : -15)}vw`,
                }}
                transition={{
                  duration: 3.5 + (i % 4),
                  delay: i * 0.15,
                  ease: 'linear',
                }}
                className="absolute w-3 h-3 rounded-full bg-rose-400/80 shadow-[0_0_15px_#f43f5e] blur-[1px]"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(193,18,31,0.15),transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-[0.15] mix-blend-overlay pointer-events-none" />

      {/* Police strobe background ambient flares */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute left-[5%] top-1/2 -translate-y-1/2 w-[45vw] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.25)_0%,transparent_70%)] blur-3xl transition-opacity duration-300 ${isHovered || isOpen ? 'opacity-100 animate-police-strobe-blue' : 'opacity-30'}`} />
        <div className={`absolute right-[5%] top-1/2 -translate-y-1/2 w-[45vw] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(255,0,51,0.3)_0%,transparent_70%)] blur-3xl transition-opacity duration-300 ${isHovered || isOpen ? 'opacity-100 animate-police-strobe-red' : 'opacity-30'}`} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-center">

        {/* Header */}
        <ScrollFade direction="up">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-evidence/10 border border-evidence/25 rounded-full mb-4 mx-auto">
              <ShieldAlert className="w-4 h-4 text-evidence animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-evidence font-bold">
                Classified Vault // Unseal Case
              </span>
            </div>
            <SectionHeading
              eyebrow="Evidence Locker #01"
              title="Unseal The Wooden Coffin"
              description="Hover to vibrate the wooden coffin. Click to unseal smoke effect (dissipates in 4s) and access official brochure."
              align="center"
              scrollFloat={true}
            />
          </div>
        </ScrollFade>

        {/* ── 2. REALISTIC 3D WOODEN COFFIN APPARATUS ── */}
        <div className="relative w-full max-w-[850px] min-h-[520px] flex flex-col items-center justify-center my-2">

          {/* Instruction Tooltip Badge */}
          <div className="mb-8 z-20">
            <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              isOpen
                ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                : isHovered
                ? 'bg-rose-950/90 border-rose-500/90 text-rose-300 animate-pulse shadow-[0_0_30px_rgba(225,29,72,0.5)]'
                : 'bg-zinc-900/90 border-zinc-700/80 text-zinc-300'
            }`}>
              {isOpen ? (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  COFFIN UNSEALED // BROCHURE READY
                </>
              ) : isHovered ? (
                <>
                  <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
                  CLICK TO UNSEAL COFFIN & RELEASE SMOKE
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-zinc-500" />
                  HOVER TO VIBRATE WOODEN COFFIN
                </>
              )}
            </span>
          </div>

          {/* Coffin Container Frame */}
          <div className="relative w-full flex flex-col items-center justify-center">

            {/* Dense Fog Rising from Coffin Opening (Fades with showSmoke) */}
            <AnimatePresence>
              {showSmoke && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.8 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 1.2 }}
                  className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center"
                >
                  <div className="w-[600px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.5)_0%,rgba(193,18,31,0.3)_45%,transparent_75%)] blur-2xl animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── 3D HEXAGONAL WOODEN COFFIN STRUCTURE ── */}
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleToggleOpen}
              className={`relative cursor-pointer transition-all duration-300 ${
                isHovered && !isOpen ? 'animate-coffin-vibrate scale-[1.02]' : ''
              }`}
            >
              {/* Coffin Shadow Base */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-14 bg-black/95 blur-2xl rounded-full" />

              {/* Brass Side Handles (Left & Right) */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-24 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-800 rounded-l-md border-y border-l border-amber-200 shadow-xl z-20 flex flex-col justify-between py-2">
                <div className="w-2 h-2 rounded-full bg-amber-900 border border-amber-400 mx-auto" />
                <div className="w-2 h-2 rounded-full bg-amber-900 border border-amber-400 mx-auto" />
              </div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-24 bg-gradient-to-l from-amber-600 via-amber-300 to-amber-800 rounded-r-md border-y border-r border-amber-200 shadow-xl z-20 flex flex-col justify-between py-2">
                <div className="w-2 h-2 rounded-full bg-amber-900 border border-amber-400 mx-auto" />
                <div className="w-2 h-2 rounded-full bg-amber-900 border border-amber-400 mx-auto" />
              </div>

              {/* ── COFFIN OUTER WOODEN BODY (CLASSIC OAK / MAHOGANY SHAPE) ── */}
              <div
                className="relative w-[340px] sm:w-[540px] lg:w-[680px] h-[200px] sm:h-[260px] p-3 shadow-[0_35px_80px_rgba(0,0,0,0.98)] transition-transform duration-500"
                style={{
                  clipPath: 'polygon(18% 0%, 82% 0%, 100% 32%, 85% 100%, 15% 100%, 0% 32%)',
                  background: 'linear-gradient(180deg, #422014 0%, #29130b 40%, #150804 100%)',
                  boxShadow: 'inset 0 0 50px rgba(0,0,0,0.95)',
                }}
              >
                {/* Wood Grain & Seam Plank Texture */}
                <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.5)_0%,rgba(255,255,255,0.06)_15%,transparent_50%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
                
                {/* Horizontal Wood Plank Lines */}
                <div className="absolute top-1/3 inset-x-0 h-[1px] bg-black/60 shadow-[0_1px_0_rgba(255,255,255,0.08)] pointer-events-none" />
                <div className="absolute top-2/3 inset-x-0 h-[1px] bg-black/60 shadow-[0_1px_0_rgba(255,255,255,0.08)] pointer-events-none" />

                {/* Brass Edge Trim Border */}
                <div
                  className="absolute inset-2 pointer-events-none border-2 border-amber-500/70"
                  style={{
                    clipPath: 'polygon(18% 0%, 82% 0%, 100% 32%, 85% 100%, 15% 100%, 0% 32%)',
                  }}
                />

                {/* ── COFFIN DEEP INTERIOR RED VELVET BED (VISIBLE WHEN OPEN) ── */}
                <div
                  className="relative w-full h-full p-6 flex flex-col items-center justify-center overflow-hidden"
                  style={{
                    clipPath: 'polygon(18% 0%, 82% 0%, 100% 32%, 85% 100%, 15% 100%, 0% 32%)',
                    background: 'radial-gradient(circle at center, #6b0f1a 0%, #30050b 60%, #120104 100%)',
                  }}
                >
                  {/* Tufted Cushion Velvet Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,68,68,0.45)_0%,transparent_70%)]" />
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 gap-6 opacity-30 pointer-events-none">
                    {Array.from({ length: 18 }).map((_, cIdx) => (
                      <div key={cIdx} className="w-2 h-2 rounded-full bg-amber-400/50 shadow-[0_0_6px_#f59e0b] m-auto" />
                    ))}
                  </div>

                  {/* ── BROCHURE CASE FILE DOSSIER (REVEALED WHEN OPEN) ── */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 70, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8 }}
                        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
                        className="relative z-40 flex flex-col items-center text-center p-5 bg-zinc-950/95 border-2 border-amber-500/80 rounded-xl shadow-[0_0_50px_rgba(245,158,11,0.5)] backdrop-blur-xl max-w-[88%]"
                      >
                        <div className="flex items-center gap-2 text-amber-400 mb-1 font-mono text-xs font-black tracking-widest uppercase">
                          <FileText className="w-5 h-5 text-amber-400" />
                          OFFICIAL CASE FILE BROCHURE
                        </div>

                        <h4 className="font-display text-base sm:text-xl font-bold text-white uppercase tracking-wide leading-tight">
                          SMACKATHON 2K26 DOSSIER
                        </h4>
                        <p className="font-mono text-[10px] sm:text-xs text-zinc-300 mt-1 max-w-md">
                          Full event breakdown, problem statements, cash prizes, and timeline guidelines.
                        </p>

                        {/* Brochure Download / View Buttons */}
                        <div className="mt-4 flex flex-wrap justify-center gap-3">
                          <a
                            href="/SMACKATHON_2K26_info.docx"
                            download="SMACKATHON_2K26_Brochure.docx"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-mono font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-600 hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]"
                          >
                            <Download className="w-4 h-4" />
                            Download Brochure (.DOCX)
                          </a>
                          <a
                            href="/hackathon"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 border border-white/20 bg-white/10 text-white font-mono font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-all duration-300 hover:bg-white/20 hover:border-white/50"
                          >
                            <Eye className="w-4 h-4 text-amber-300" />
                            View Online
                            <ChevronRight className="w-4 h-4" />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── REALISTIC WOODEN COFFIN LID ── */}
                <motion.div
                  animate={{
                    y: isOpen ? -200 : 0,
                    rotateX: isOpen ? -30 : 0,
                    scale: isOpen ? 0.92 : 1,
                    opacity: isOpen ? 0.85 : 1,
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 p-6 flex flex-col items-center justify-center z-30 pointer-events-none shadow-2xl"
                  style={{
                    clipPath: 'polygon(18% 0%, 82% 0%, 100% 32%, 85% 100%, 15% 100%, 0% 32%)',
                    background: 'linear-gradient(180deg, #572d1f 0%, #381a10 50%, #1a0a05 100%)',
                    boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.25), 0 25px 60px rgba(0,0,0,0.95)',
                  }}
                >
                  {/* Wood Grain Texture & Plank Lines */}
                  <div className="absolute inset-0 bg-noise opacity-35" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_0%,transparent_40%,rgba(0,0,0,0.75)_100%)]" />
                  <div className="absolute top-1/3 inset-x-0 h-[1px] bg-black/60 shadow-[0_1px_0_rgba(255,255,255,0.1)]" />
                  <div className="absolute top-2/3 inset-x-0 h-[1px] bg-black/60 shadow-[0_1px_0_rgba(255,255,255,0.1)]" />

                  {/* Gold / Brass Beveled Trim Border */}
                  <div
                    className="absolute inset-3 border-2 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    style={{
                      clipPath: 'polygon(18% 0%, 82% 0%, 100% 32%, 85% 100%, 15% 100%, 0% 32%)',
                    }}
                  />

                  {/* Embossed Metallic Brass Cross / Emblem */}
                  <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400/90 bg-[#1f0d06] flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.5)] mb-3">
                    <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 drop-shadow-md" />
                  </div>

                  {/* Coffin Engraved Text */}
                  <span className="relative z-10 font-display text-sm sm:text-base font-black tracking-[0.2em] text-amber-100 uppercase text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    CYBER CRIME COFFIN #01
                  </span>
                  <span className="relative z-10 font-mono text-[9px] sm:text-[10px] text-rose-400 font-extrabold tracking-widest uppercase mt-1">
                    {isOpen ? 'UNSEALED' : 'TAP TO UNSEAL COFFIN'}
                  </span>
                </motion.div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
