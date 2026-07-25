import { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye, ChevronRight, ShieldAlert, Sparkles, Lock, Flame } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════════════
   DIRT & GRAVE EMBERS DATA
   ══════════════════════════════════════════════════════════════════ */
const SOIL_COLORS = ['#5c3a1e', '#7a4e2a', '#3d2010', '#8b6840', '#4a2f14', '#654321', '#9a6b38'];

const DIRT_PARTICLES = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  x: 18 + (Math.sin(i * 1.5) * 0.5 + 0.5) * 64,
  startBottom: 3 + (i * 2.1) % 25,
  size: 3 + ((i * 7) % 11),
  rotation: (i * 47) % 360,
  color: SOIL_COLORS[i % SOIL_COLORS.length],
  rounded: i % 3 === 0,
}));

/* ══════════════════════════════════════════════════════════════════
   DEEP GRAVE EARTH CRACK DEFINITIONS
   ══════════════════════════════════════════════════════════════════ */
const CRACKS = [
  { top: '6%', left: '15%', w: '24%', r: -5, glow: '#ff4d00' },
  { top: '3%', left: '36%', w: '28%', r: 4, glow: '#ffaa00' },
  { top: '10%', left: '58%', w: '20%', r: -8, glow: '#ff3300' },
  { top: '2%', left: '22%', w: '16%', r: 12, glow: '#ff8800' },
  { top: '14%', left: '62%', w: '22%', r: -4, glow: '#ff4d00' },
  { top: '5%', left: '8%', w: '14%', r: 7, glow: '#ff2200' },
  { top: '8%', left: '72%', w: '16%', r: -6, glow: '#ffaa00' },
  { top: '11%', left: '30%', w: '15%', r: 5, glow: '#ff6600' },
];

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════ */
export default function CyberCoffinVault() {
  const sectionRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);

  /* ── Auto-dismiss smoke after 6s ── */
  useEffect(() => {
    if (isOpen && showSmoke) {
      const t = setTimeout(() => setShowSmoke(false), 6000);
      return () => clearTimeout(t);
    }
  }, [isOpen, showSmoke]);

  /* ── Handle coffin tap (always works cleanly) ── */
  const handleClick = useCallback((e) => {
    if (e) e.stopPropagation();
    setIsOpen((prev) => {
      if (!prev) {
        setShowSmoke(true);
        return true;
      }
      setShowSmoke(false);
      return false;
    });
  }, []);

  /* ════════════════════════════════════════════════════════════════
     GSAP SCROLLTRIGGER — PINNED PARALLAX TIMELINE
     ════════════════════════════════════════════════════════════════ */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=260%',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            setIsReady(self.progress >= 0.75);
          },
        },
      });

      /* Phase 1: Grave ground surface & earth mound fade in */
      tl.fromTo(
        '.vault-ground',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' },
        0,
      );

      /* Phase 1b: Glowing molten cracks spread across earth */
      tl.fromTo(
        '.grave-crack',
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, stagger: 0.02, duration: 0.2, ease: 'power2.out' },
        0.04,
      );

      /* Phase 2: Deep subterranean grave pit opens */
      tl.fromTo(
        '.grave-hole',
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.18, ease: 'power3.out' },
        0.1,
      );

      /* Ground fog mist rises from pit */
      tl.fromTo(
        '.grave-mist',
        { opacity: 0, scale: 0.7 },
        { opacity: 0.85, scale: 1.2, duration: 0.25 },
        0.12,
      );

      /* Phase 2b: Soil particles & rock embers erupt */
      tl.fromTo(
        '.dirt-particle',
        { y: 0, opacity: 0 },
        {
          y: (i) => -(160 + ((i * 37) % 280)),
          opacity: 0.9,
          rotation: (i) => ((i * 47) % 360) + ((i * 23) % 180) - 90,
          stagger: { each: 0.008, from: 'center' },
          duration: 0.32,
          ease: 'power1.out',
        },
        0.16,
      );

      /* Subterranean earth tremor */
      tl.to(
        '.vault-ground',
        { x: 4, yoyo: true, repeat: 8, duration: 0.012, ease: 'none' },
        0.2,
      );

      /* Phase 3: Coffin rises out of grave pit */
      tl.fromTo(
        '.coffin-wrapper',
        { y: 400, opacity: 0, scale: 0.88 },
        { y: 0, opacity: 1, scale: 1, duration: 0.42, ease: 'power2.out' },
        0.26,
      );

      /* Coffin shadow spreads on soil */
      tl.fromTo(
        '.coffin-drop-shadow',
        { opacity: 0, scaleX: 0.2 },
        { opacity: 0.95, scaleX: 1, duration: 0.3 },
        0.4,
      );

      /* Phase 4: Dirt settles */
      tl.to(
        '.dirt-particle',
        {
          opacity: 0,
          y: '-=120',
          stagger: { each: 0.006, from: 'random' },
          duration: 0.22,
        },
        0.6,
      );

      /* Ambient crimson/gold lighting activates */
      tl.fromTo(
        '.coffin-ambient',
        { opacity: 0 },
        { opacity: 1, duration: 0.15 },
        0.72,
      );

      /* Hint instruction badge appears */
      tl.fromTo(
        '.vault-hint',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.1 },
        0.82,
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ═══════════ PINNED PARALLAX GRAVE SECTION ═══════════ */}
      <section
        ref={sectionRef}
        className="relative h-screen bg-[#050404] overflow-hidden select-none"
      >
        {/* Dark noise overlay */}
        <div className="absolute inset-0 bg-noise opacity-[0.06] mix-blend-overlay pointer-events-none" />

        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className={`absolute left-[2%] top-[35%] -translate-y-1/2 w-[42vw] h-[320px] bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.2)_0%,transparent_70%)] blur-2xl transition-opacity duration-700 ${
              isOpen
                ? 'opacity-100 animate-police-strobe-blue'
                : isHovered
                  ? 'opacity-60'
                  : 'opacity-20'
            }`}
          />
          <div
            className={`absolute right-[2%] top-[35%] -translate-y-1/2 w-[42vw] h-[360px] bg-[radial-gradient(ellipse_at_center,rgba(255,0,51,0.22)_0%,transparent_70%)] blur-2xl transition-opacity duration-700 ${
              isOpen
                ? 'opacity-100 animate-police-strobe-red'
                : isHovered
                  ? 'opacity-60'
                  : 'opacity-20'
            }`}
          />
        </div>

        {/* ═══════════ SECTION-WIDE WHITE & RED VOLUMETRIC SMOKE EFFECT ═══════════ */}
        <AnimatePresence>
          {showSmoke && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 pointer-events-none z-40 overflow-hidden"
            >
              {/* WHITE SMOKE LAYER 1 — Thick Pure White / Silver Fog */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0, y: 120 }}
                animate={{ scale: 1.9, opacity: 0.65, y: -50 }}
                exit={{ opacity: 0, scale: 2.3 }}
                transition={{ duration: 5, ease: 'easeInOut' }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(255,255,255,0.55)_0%,rgba(230,230,245,0.25)_40%,transparent_75%)] blur-2xl"
              />

              {/* RED SMOKE LAYER 2 — Intense Crimson Evidence Red Mist */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 60 }}
                animate={{ scale: 2.1, opacity: 0.55, y: -90 }}
                exit={{ opacity: 0, scale: 2.5 }}
                transition={{ duration: 5.5, delay: 0.1, ease: 'easeInOut' }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,0,51,0.45)_0%,rgba(193,18,31,0.3)_45%,transparent_80%)] blur-2xl"
              />

              {/* DENSE WHITE/RED COMBINED FLOOR MIST */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 0.7, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute bottom-0 inset-x-0 h-[35vh] bg-[linear-gradient(to_top,rgba(255,255,255,0.3),rgba(255,0,51,0.2),transparent)] blur-xl"
              />

              {/* ALTERNATING WHITE & RED SPARKS */}
              {Array.from({ length: 24 }).map((_, i) => {
                const isWhite = i % 2 === 0;
                return (
                  <motion.div
                    key={`smoke-spark-${i}`}
                    initial={{
                      opacity: 0,
                      y: '90vh',
                      x: `${(i * 4.2) % 100}%`,
                      scale: 0.4 + (i % 4) * 0.25,
                    }}
                    animate={{
                      opacity: [0, 0.95, 0],
                      y: '10vh',
                      x: `${((i * 4.2) % 100) + (i % 2 === 0 ? 10 : -10)}%`,
                    }}
                    transition={{
                      duration: 2.4 + (i % 3),
                      delay: i * 0.08,
                      ease: 'linear',
                    }}
                    className={`absolute w-3 h-3 rounded-full ${
                      isWhite
                        ? 'bg-white shadow-[0_0_12px_#ffffff]'
                        : 'bg-red-500 shadow-[0_0_12px_#ff0033]'
                    }`}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visual Content Container */}
        <div className="relative w-full h-full flex flex-col items-center justify-center z-10">

          {/* ═══════════ REALISTIC ENHANCED GRAVE / EARTH LAYER ═══════════ */}
          <div className="vault-ground absolute bottom-0 left-0 right-0 h-[45%] opacity-0 will-change-transform z-10">
            {/* Deep underground earth gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060302] via-[#1c0f08] to-[#0c0603]" />

            {/* Surface Soil Line */}
            <div className="absolute top-0 left-0 right-0">
              <div className="h-[4px] bg-gradient-to-r from-transparent via-[#8b5a2b] to-transparent opacity-80" />
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#d4a359] to-transparent opacity-40 mt-px" />
            </div>

            {/* Earth Mound / Dirt Edges */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-12 bg-[radial-gradient(ellipse_at_top,rgba(110,65,30,0.5)_0%,transparent_70%)] blur-md pointer-events-none" />

            {/* Soil texture & strata lines */}
            <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
            <div className="absolute top-3 inset-x-0 h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_8px,rgba(0,0,0,0.3)_8px,rgba(0,0,0,0.3)_9px)] opacity-30" />

            {/* Molten Glow Cracks (GSAP animated) */}
            {CRACKS.map((c, i) => (
              <div
                key={`crack-${i}`}
                className="grave-crack absolute h-[3px] origin-left"
                style={{
                  top: c.top,
                  left: c.left,
                  width: c.w,
                  transform: `rotate(${c.r}deg) scaleX(0)`,
                  background: `linear-gradient(90deg, transparent, ${c.glow}, rgba(255,200,50,0.9), transparent)`,
                  boxShadow: `0 0 8px ${c.glow}`,
                }}
              />
            ))}

            {/* Deep Grave Pit Hole */}
            <div
              className="grave-hole absolute top-0 left-1/2 -translate-x-1/2 w-[360px] sm:w-[580px] lg:w-[760px] h-[200px] origin-top opacity-0"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.98) 0%, rgba(20,5,2,0.85) 45%, transparent 75%)',
                boxShadow: 'inset 0 15px 40px rgba(0,0,0,0.95)',
              }}
            />

            {/* Subterranean Mist in Hole */}
            <div className="grave-mist absolute top-2 left-1/2 -translate-x-1/2 w-[450px] sm:w-[650px] h-[100px] rounded-full bg-[radial-gradient(circle,rgba(255,0,51,0.25)_0%,rgba(255,255,255,0.2)_50%,transparent_80%)] blur-lg pointer-events-none opacity-0" />
          </div>

          {/* ═══════════ DIRT & ROCK PARTICLES ═══════════ */}
          {DIRT_PARTICLES.map((p) => (
            <div
              key={`dirt-${p.id}`}
              className={`dirt-particle absolute pointer-events-none opacity-0 z-20 ${
                p.rounded ? 'rounded-full' : 'rounded-sm'
              }`}
              style={{
                left: `${p.x}%`,
                bottom: `${p.startBottom}%`,
                width: p.size,
                height: p.size * (p.rounded ? 1 : 0.7),
                backgroundColor: p.color,
                boxShadow: p.id % 4 === 0 ? '0 0 6px rgba(245,158,11,0.6)' : 'none',
                transform: `rotate(${p.rotation}deg)`,
              }}
            />
          ))}

          {/* ═══════════ COFFIN WRAPPER (rises out of grave) ═══════════ */}
          <div
            className="coffin-wrapper relative z-30 will-change-transform flex flex-col items-center"
            style={{ opacity: 0 }}
          >
            {/* Ground Drop Shadow */}
            <div className="coffin-drop-shadow absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-16 bg-black/90 blur-2xl rounded-full opacity-0" />

            {/* Ambient Coffin Glow */}
            <div
              className={`coffin-ambient absolute -inset-24 pointer-events-none opacity-0 ${
                isReady ? 'animate-coffin-glow-pulse' : ''
              }`}
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(193,18,31,0.22) 0%, rgba(245,158,11,0.1) 45%, transparent 70%)',
              }}
            />

            {/* LOCAL WHITE & RED SMOKE BURST FROM COFFIN */}
            <AnimatePresence>
              {showSmoke && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.6 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 1 }}
                  className="absolute -inset-16 pointer-events-none z-30 flex items-center justify-center"
                >
                  {/* White smoke burst core */}
                  <div className="w-[540px] h-[270px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.6)_0%,rgba(255,0,51,0.35)_45%,transparent_75%)] blur-xl animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── INTERACTIVE COFFIN BODY ── */}
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleClick}
              className={`relative cursor-pointer transition-transform duration-300 ${
                isHovered && !isOpen ? 'animate-coffin-vibrate scale-[1.02]' : ''
              }`}
            >
              {/* Brass Side Handles */}
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-5 h-28 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-800 rounded-l-lg border-y border-l border-amber-300/70 shadow-2xl z-20 flex flex-col justify-between py-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-950 border border-amber-400 mx-auto" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-950 border border-amber-400 mx-auto" />
              </div>
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-5 h-28 bg-gradient-to-l from-amber-700 via-amber-400 to-amber-800 rounded-r-lg border-y border-r border-amber-300/70 shadow-2xl z-20 flex flex-col justify-between py-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-950 border border-amber-400 mx-auto" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-950 border border-amber-400 mx-auto" />
              </div>

              {/* ══════════ COFFIN OUTER WOOD BODY ══════════ */}
              <div
                className="relative w-[320px] sm:w-[520px] lg:w-[680px] h-[200px] sm:h-[260px] shadow-[0_35px_90px_rgba(0,0,0,0.98)]"
                style={{
                  clipPath:
                    'polygon(18% 0%, 82% 0%, 100% 32%, 85% 100%, 15% 100%, 0% 32%)',
                  background:
                    'linear-gradient(180deg, #422014 0%, #29130b 40%, #150804 100%)',
                }}
              >
                {/* Wood Grain & Plank texture */}
                <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.5)_0%,rgba(255,255,255,0.06)_15%,transparent_50%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
                <div className="absolute top-1/3 inset-x-0 h-[1px] bg-black/60 shadow-[0_1px_0_rgba(255,255,255,0.08)]" />
                <div className="absolute top-2/3 inset-x-0 h-[1px] bg-black/60 shadow-[0_1px_0_rgba(255,255,255,0.08)]" />

                {/* Outer Brass Trim */}
                <div
                  className="absolute inset-2 pointer-events-none border-2 border-amber-500/70"
                  style={{
                    clipPath:
                      'polygon(18% 0%, 82% 0%, 100% 32%, 85% 100%, 15% 100%, 0% 32%)',
                  }}
                />

                {/* ── COFFIN INTERIOR RED VELVET BED ── */}
                <div
                  className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
                  style={{
                    clipPath:
                      'polygon(18% 0%, 82% 0%, 100% 32%, 85% 100%, 15% 100%, 0% 32%)',
                    background:
                      'radial-gradient(circle at center, #7a0c17 0%, #38040a 55%, #140104 100%)',
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,68,68,0.4)_0%,transparent_70%)]" />
                  <div className="absolute inset-0 grid grid-cols-5 grid-rows-3 gap-5 opacity-25 pointer-events-none">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-amber-400/60 shadow-[0_0_6px_#f59e0b] m-auto"
                      />
                    ))}
                  </div>
                </div>

                {/* ══════════ COFFIN LID (slides up on open) ══════════ */}
                <motion.div
                  animate={{
                    y: isOpen ? -190 : 0,
                    rotateX: isOpen ? -28 : 0,
                    scale: isOpen ? 0.92 : 1,
                    opacity: isOpen ? 0.75 : 1,
                  }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
                  style={{
                    clipPath:
                      'polygon(18% 0%, 82% 0%, 100% 32%, 85% 100%, 15% 100%, 0% 32%)',
                    background:
                      'linear-gradient(180deg, #572d1f 0%, #381a10 50%, #1a0a05 100%)',
                    boxShadow:
                      'inset 0 2px 10px rgba(255,255,255,0.22), 0 25px 60px rgba(0,0,0,0.95)',
                  }}
                >
                  <div className="absolute inset-0 bg-noise opacity-35" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,transparent_40%,rgba(0,0,0,0.65)_100%)]" />

                  <div className="absolute top-1/3 inset-x-0 h-[1px] bg-black/60 shadow-[0_1px_0_rgba(255,255,255,0.08)]" />
                  <div className="absolute top-2/3 inset-x-0 h-[1px] bg-black/60 shadow-[0_1px_0_rgba(255,255,255,0.08)]" />

                  <div
                    className="absolute inset-3 border-2 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    style={{
                      clipPath:
                        'polygon(18% 0%, 82% 0%, 100% 32%, 85% 100%, 15% 100%, 0% 32%)',
                    }}
                  />

                  {/* Emblem */}
                  <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400/90 bg-[#1f0d06] flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.45)] mb-2">
                    <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 drop-shadow-md" />
                  </div>

                  <span className="relative z-10 font-display text-xs sm:text-base font-black tracking-[0.18em] text-amber-100 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    UPSURGE 2K26
                  </span>
                  <span className="relative z-10 font-mono text-[8px] sm:text-[9px] text-rose-400 font-extrabold tracking-widest uppercase mt-1">
                    {isOpen ? 'UNSEALED' : 'TAP TO UNSEAL'}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* ══════════ HIGH-END CLASSIFIED BROCHURE DOSSIER CARD ══════════ */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 60, scale: 0.85 }}
                  animate={{ opacity: 1, y: -20, scale: 1 }}
                  exit={{ opacity: 0, y: 40, scale: 0.85 }}
                  transition={{
                    duration: 0.55,
                    type: 'spring',
                    damping: 20,
                    stiffness: 280,
                  }}
                  className="absolute z-50 flex flex-col items-center text-center p-6 sm:p-8 bg-[#0b0c13] border-2 border-rose-500/70 rounded-2xl shadow-[0_0_60px_rgba(225,29,72,0.4),0_0_20px_rgba(245,158,11,0.2)] w-[92%] max-w-[560px] overflow-hidden"
                >
                  {/* Top Hazard Accent Line */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600" />

                  {/* Corner brass tacks / rivets */}
                  <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-amber-400/80 border border-amber-200" />
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-400/80 border border-amber-200" />
                  <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-amber-400/80 border border-amber-200" />
                  <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-amber-400/80 border border-amber-200" />

                  {/* Top Classified Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-950/80 border border-rose-500/50 rounded-md mb-3">
                    <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                    <span className="font-mono text-[10px] sm:text-xs font-black text-rose-300 tracking-[0.2em] uppercase">
                      TOP SECRET // CASE FILE BROCHURE
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-lg sm:text-2xl font-black text-white uppercase tracking-wider drop-shadow-md">
                    SMACKATHON 2K26 DOSSIER
                  </h3>
                  <p className="font-mono text-[11px] sm:text-xs text-zinc-300 mt-2 leading-relaxed max-w-md">
                    Full event breakdown, problem statements, cash prizes, and timeline guidelines.
                  </p>

                  {/* Brochure Action Buttons */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full">
                    <a
                      href="/images/events/SMACKATHON_2K26_Brochure.pdf"
                      download="SMACKATHON_2K26_Brochure.pdf"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-white" />
                      DOWNLOAD BROCHURE (.PDF)
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ══════════ HINT INSTRUCTION BADGE ══════════ */}
          <div className="vault-hint absolute bottom-[6%] sm:bottom-[8%] left-1/2 -translate-x-1/2 text-center opacity-0 z-40">
            <span
              onClick={handleClick}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border font-mono text-xs font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 ${
                isOpen
                  ? 'bg-rose-950/90 border-rose-500/80 text-rose-300 shadow-[0_0_25px_rgba(225,29,72,0.4)]'
                  : isHovered
                    ? 'bg-rose-950/90 border-rose-500/90 text-rose-300 animate-pulse shadow-[0_0_30px_rgba(225,29,72,0.5)]'
                    : 'bg-zinc-900/90 border-zinc-700/80 text-zinc-300 hover:border-zinc-500'
              }`}
            >
              {isOpen ? (
                <>
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  TAP COFFIN TO CLOSE DOSSIER
                </>
              ) : isHovered ? (
                <>
                  <Sparkles className="w-4 h-4 text-rose-400 animate-bounce" />
                  TAP TO UNSEAL COFFIN &amp; RELEASE SMOKE
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-zinc-500" />
                  TAP COFFIN TO UNSEAL BROCHURE
                </>
              )}
            </span>
          </div>

        </div>
      </section>
    </>
  );
}
