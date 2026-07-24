import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Spotlight } from '../ui/spotlight.tsx';
import { SplineScene } from '../ui/splite.tsx';
import { Shield, Terminal } from 'lucide-react';

export default function Hero() {
  const [loadSpline, setLoadSpline] = useState(false);

  useEffect(() => {
    // Delay Spline loading to prevent main-thread blocking during initial page load
    const timer = setTimeout(() => {
      setLoadSpline(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <section className="relative w-full min-h-[560px] h-[85vh] sm:aspect-auto sm:h-[80vh] lg:h-[calc(100vh-64px)] sm:min-h-[620px] lg:min-h-[720px] max-h-[1050px] overflow-hidden bg-case-black">
      
      {/* ── 1. CINEMATIC UNREAL ENGINE 5 COFFIN BACKDROP IMAGE ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/images/hero-coffin.png"
          alt="Cyber Crime Investigation Scene"
          fetchPriority="high"
          loading="eager"
          className="w-full h-full object-cover object-center opacity-70 mix-blend-luminosity filter brightness-90 contrast-125 scale-105 transform transition-transform duration-1000 ease-out"
        />
        {/* Dark Vignette Overlay for Crisp Typography Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-case-black via-case-black/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-case-black via-transparent to-case-black/40 z-10" />
      </div>

      {/* ── 2. RADIAL AMBIENT CRIMSON & BLUE POLICE GLOW ── */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(193,18,31,0.3)_0%,rgba(0,102,255,0.15)_45%,transparent_75%)] z-10"
        aria-hidden="true"
      />

      {/* ── 3. MOUSE-TRACKING SPOTLIGHT ── */}
      <Spotlight size={580} className="z-15" />

      {/* ── 4. NOISE ATMOSPHERE ── */}
      <div
        className="pointer-events-none absolute inset-0 bg-noise opacity-25 z-15"
        aria-hidden="true"
      />

      {/* ── 5. SCANLINE SWEEP ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-terminal/25 to-transparent animate-scanline z-15"
        aria-hidden="true"
      />

      {/* ── 6. Main layout ── */}
      <div className="relative z-20 flex h-full w-full">

        {/* Left — text content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full flex-col justify-center px-6 sm:px-12 lg:px-16 lg:w-1/2"
        >
          {/* Kicker */}
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-evidence mb-4">
            ◈ &nbsp; CSE Dept · YCCE Nagpur &nbsp; ◈
          </p>

          {/* Main headline logo image */}
          <div className="relative w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[540px] xl:max-w-[640px] filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] drop-shadow-[0_0_20px_rgba(193,18,31,0.4)]">
            <img
              src="/images/logo/up-name.png"
              alt="UPSURGE 2K26"
              fetchPriority="high"
              loading="eager"
              className="w-full h-auto object-contain select-none pointer-events-none"
            />
          </div>

          {/* Subheading tag */}
          <p className="font-mono text-xs sm:text-sm text-zinc-400 uppercase tracking-widest mt-5 max-w-md">
            Annual National Technical Festival // Theme: Cyber Crime Investigation
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/hackathon"
              className="inline-flex items-center gap-2 rounded border border-evidence bg-evidence px-6 py-3.5 font-mono text-xs uppercase tracking-widest text-white shadow-[0_0_25px_rgba(193,18,31,0.5)] transition-all duration-300 hover:bg-evidence/80 hover:scale-105 hover:shadow-[0_0_35px_rgba(193,18,31,0.7)]"
            >
              Smackathon 2K26
            </a>
            <a
              href="/events"
              className="inline-flex items-center gap-2 rounded border border-white/20 bg-white/5 backdrop-blur-md px-6 py-3.5 font-mono text-xs uppercase tracking-widest text-white/80 transition-all duration-300 hover:border-white/50 hover:bg-white/10 hover:text-white hover:scale-105"
            >
              Browse Events
            </a>
          </div>
        </motion.div>

        {/* Interactive 3D scene from Spline with high-tech HUD styling */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex lg:w-1/2 h-full items-center justify-center relative z-20"
        >
          <div className="relative w-[42rem] h-[42rem] xl:w-[48rem] xl:h-[48rem] flex items-center justify-center">
            {/* Glowing background behind Spline scene */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(193,18,31,0.15),transparent_65%)] blur-2xl" aria-hidden="true" />

            {/* Spline Canvas component */}
            <div className="w-full h-full p-2 z-10 relative">
              {loadSpline ? (
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-evidence/50 font-mono text-xs uppercase tracking-widest animate-pulse">
                  Initializing 3D Environment...
                </div>
              )}
            </div>

            {/* Status HUD Overlays using Lucide Icons */}
            <div className="absolute top-12 right-12 z-30 flex items-center gap-2 bg-case-black/85 backdrop-blur border border-evidence/30 rounded-md px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-evidence shadow-[0_0_15px_rgba(193,18,31,0.2)]">
              <Shield className="w-3.5 h-3.5 animate-pulse text-evidence" />
              <span>SECURE CONSOLE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            </div>

            <div className="absolute bottom-12 left-12 z-30 flex flex-col gap-1 bg-case-black/85 backdrop-blur border border-white/10 rounded-md p-3 font-mono text-[10px] text-zinc-400 min-w-[160px] shadow-lg">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <Terminal className="w-3.5 h-3.5 text-evidence" />
                <span>INVESTIGATION HUD</span>
              </div>
              <div className="h-[1px] bg-white/10 my-1" />
              <div className="flex justify-between">
                <span>STATUS:</span>
                <span className="text-evidence">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span>THREAT:</span>
                <span className="text-zinc-500">LEVEL 4</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom gradient fade ── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-28 bg-gradient-to-t from-case-black via-case-black/60 to-transparent z-30"
        aria-hidden="true"
      />
    </section>
  );
}
