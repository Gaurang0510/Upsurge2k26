export default function Hero() {
  return (
    <section className="relative w-full aspect-video sm:aspect-auto sm:h-[75vh] lg:h-[calc(100vh-64px)] sm:min-h-[580px] lg:min-h-[680px] max-h-[1000px] overflow-hidden bg-case-black px-4 sm:px-0">
      {/* Radial ambient crimson glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(193,18,31,0.25),transparent_70%)]"
        aria-hidden="true"
      />

      {/* Noise atmosphere + scanline animation */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-30 z-10" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-terminal/20 to-transparent animate-scanline z-10"
        aria-hidden="true"
      />

      {/* 3D Spline Interactive Canvas */}
      <iframe
        src="https://my.spline.design/cybermannequin-ccOtsiHhCv3krIP92SQIuq2s/"
        frameBorder="0"
        width="100%"
        height="100%"
        title="Spline 3D Cyber Mannequin"
        className="relative z-10 h-full w-full border-0 select-none"
        allow="fullscreen; autoplay; xr-spatial-tracking"
      />

      {/* Bottom atmospheric gradient fade for smooth section transition */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 sm:h-24 bg-gradient-to-t from-case-black via-case-black/50 to-transparent z-20" />
    </section>
  );
}






















