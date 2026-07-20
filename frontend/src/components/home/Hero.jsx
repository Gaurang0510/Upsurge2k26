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
        <div className="flex w-full flex-col justify-center px-6 sm:px-12 lg:px-16 lg:w-1/2">
          {/* Kicker */}
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-evidence mb-4">
            ◈ &nbsp; CSE Dept · YCCE Nagpur &nbsp; ◈
          </p>

          {/* Main headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-wider text-white leading-none">
            UPSURGE
            <br />
            <span className="text-evidence">2K26</span>
          </h1>

          {/* Theme line */}
          <p className="mt-5 font-mono text-base sm:text-lg text-green-400/90 tracking-wider">
            &ldquo;The system has been compromised.&rdquo;
          </p>

          {/* Sub-description */}
          <p className="mt-3 max-w-sm font-mono text-sm leading-7 text-white/60">
            Theme: <span className="text-white/90">Crime &amp; Cyber Crime</span>.
            Hackathons, CTFs, esports &amp; 13+ events.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/hackathon"
              className="inline-flex items-center gap-2 rounded border border-evidence bg-evidence px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-white transition-all duration-200 hover:bg-evidence/80"
            >
              Operation Breach
            </a>
            <a
              href="/events"
              className="inline-flex items-center gap-2 rounded border border-white/20 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-white/80 transition-all duration-200 hover:border-white/50 hover:text-white"
            >
              Browse Events
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-10 flex gap-6">
            {[
              { value: '13+', label: 'Events' },
              { value: '24h', label: 'Hackathon' },
              { value: '2026', label: 'Edition' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-white">{s.value}</p>
                <p className="font-mono text-xs uppercase tracking-widest text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Spline 3D scene */}
        <div className="hidden lg:flex lg:w-1/2 h-full items-center justify-center">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* ── Bottom gradient fade ── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 sm:h-24 bg-gradient-to-t from-case-black via-case-black/50 to-transparent z-30"
        aria-hidden="true"
      />
    </section>
  );
}
