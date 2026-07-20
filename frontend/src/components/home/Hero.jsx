import { motion } from 'framer-motion';
import { SplineScene } from '../ui/splite.jsx';
import { Spotlight } from '../ui/spotlight.jsx';

export default function Hero() {
  return (
    <section className="relative w-full aspect-video sm:aspect-auto sm:h-[75vh] lg:h-[calc(100vh-64px)] sm:min-h-[580px] lg:min-h-[680px] max-h-[1000px] overflow-hidden bg-case-black">

      {/* ── Radial ambient crimson glow ── */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(193,18,31,0.25),transparent_70%)]"
        aria-hidden="true"
      />

      {/* ── Mouse-tracking spotlight ── */}
      <Spotlight size={520} className="z-10" />

      {/* ── Noise atmosphere ── */}
      <div
        className="pointer-events-none absolute inset-0 bg-noise opacity-30 z-10"
        aria-hidden="true"
      />

      {/* ── Scanline sweep ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-terminal/20 to-transparent animate-scanline z-10"
        aria-hidden="true"
      />

      {/* ── Main layout: text left, Spline right ── */}
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

          {/* Main headline */}
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-wider leading-[0.9] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            UPSURGE
            <br />
            <span className="text-evidence drop-shadow-[0_0_40px_rgba(193,18,31,0.8)]">2K26</span>
          </h1>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/hackathon"
              className="inline-flex items-center gap-2 rounded border border-evidence bg-evidence px-6 py-3 font-mono text-xs uppercase tracking-widest text-white shadow-[0_0_20px_rgba(193,18,31,0.4)] transition-all duration-200 hover:bg-evidence/80 hover:shadow-[0_0_30px_rgba(193,18,31,0.6)]"
            >
              Smackathon 2K26
            </a>
            <a
              href="/events"
              className="inline-flex items-center gap-2 rounded border border-white/20 bg-white/5 backdrop-blur-md px-6 py-3 font-mono text-xs uppercase tracking-widest text-white/80 transition-all duration-200 hover:border-white/50 hover:bg-white/10 hover:text-white"
            >
              Browse Events
            </a>
          </div>
        </motion.div>

        {/* Right — Spline 3D scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex lg:w-1/2 h-full items-center justify-center"
        >
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </motion.div>
      </div>

      {/* ── Bottom gradient fade ── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 sm:h-24 bg-gradient-to-t from-case-black via-case-black/50 to-transparent z-30"
        aria-hidden="true"
      />
    </section>
  );
}
