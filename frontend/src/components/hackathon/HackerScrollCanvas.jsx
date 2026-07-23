import { useEffect, useRef } from 'react';

const TOTAL_FRAMES = 120;
const FOLDER = '/images/webp scrolling images';

export default function HackerScrollCanvas({ scrollYProgress }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef(new Array(TOTAL_FRAMES).fill(null));
  const currentRef = useRef(-1);
  const pendingRef = useRef(0);
  const rafRef = useRef(null);
  const overlayRef = useRef(null);

  /* ── Draw one frame ── */
  function draw(idx) {
    const canvas = canvasRef.current;
    const img = imagesRef.current[idx];
    if (!canvas || !img?.complete || !img.naturalWidth) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = '#0A0A0B';
    ctx.fillRect(0, 0, W, H);

    const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
    currentRef.current = idx;
  }

  /* ── rAF-gated draw — never blocks scroll ── */
  function scheduleFrame(idx) {
    pendingRef.current = idx;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const t = pendingRef.current;
      if (imagesRef.current[t]?.complete && imagesRef.current[t]?.naturalWidth) {
        draw(t);
      } else {
        // Find nearest loaded frame (search ±20)
        for (let d = 1; d <= 20; d++) {
          const lo = t - d, hi = t + d;
          if (lo >= 0 && imagesRef.current[lo]?.complete && imagesRef.current[lo]?.naturalWidth) { draw(lo); break; }
          if (hi < TOTAL_FRAMES && imagesRef.current[hi]?.complete && imagesRef.current[hi]?.naturalWidth) { draw(hi); break; }
        }
      }
    });
  }

  /* ── Preload: batched, yields main thread every 16ms ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* Size canvas — cap DPR at 1.5 to halve pixel budget on retina */
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);

    const imgs = imagesRef.current;

    /* Frame 0 first — instant first paint */
    const first = new Image();
    first.onload = () => {
      imgs[0] = first;
      draw(0);
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '0';
        setTimeout(() => { if (overlayRef.current) overlayRef.current.style.display = 'none'; }, 400);
      }
    };
    first.src = `${FOLDER}/frame_001.webp`;
    imgs[0] = first;

    /* Load remaining in batches of 8, yielding 16ms between batches.
       This keeps the main thread free for scroll events. */
    let cursor = 1;
    function loadBatch() {
      const end = Math.min(cursor + 8, TOTAL_FRAMES);
      for (let i = cursor; i < end; i++) {
        const frameIdx = i;
        const img = new Image();
        img.onload = () => {
          imgs[frameIdx] = img;
          if (Math.abs(frameIdx - currentRef.current) <= 5) scheduleFrame(currentRef.current);
        };
        img.src = `${FOLDER}/frame_${String(frameIdx + 1).padStart(3, '0')}.webp`;
        imgs[frameIdx] = img;
      }
      cursor = end;
      if (cursor < TOTAL_FRAMES) setTimeout(loadBatch, 16);
    }
    /* Delay start so initial React paint isn't competing */
    setTimeout(loadBatch, 150);

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []); // eslint-disable-line

  /* ── Scroll subscription ── */
  useEffect(() => {
    if (!scrollYProgress) return;
    const unsub = scrollYProgress.on('change', (v) => {
      const idx = Math.min(TOTAL_FRAMES - 1, Math.round(v * (TOTAL_FRAMES - 1)));
      if (idx !== currentRef.current) scheduleFrame(idx);
    });
    return unsub;
  }, [scrollYProgress]); // eslint-disable-line

  /* ── ResizeObserver ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      draw(currentRef.current < 0 ? 0 : currentRef.current);
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 28%, rgba(10,10,11,0.6) 100%)',
      }} />
      <div ref={overlayRef} style={{
        position: 'absolute', inset: 0, background: '#0A0A0B', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '1.25rem', transition: 'opacity 0.4s ease',
      }}>
        <div style={{
          width: 180, height: 2,
          background: 'linear-gradient(90deg, transparent, #E10600, transparent)',
          animation: 'hkr-scan 1.2s linear infinite',
        }} />
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#E10600' }}>
          ESTABLISHING CONNECTION...
        </span>
        <style>{`@keyframes hkr-scan{0%,100%{opacity:.2;transform:scaleX(.4)}50%{opacity:1;transform:scaleX(1)}}`}</style>
      </div>
    </div>
  );
}
