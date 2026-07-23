import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Realistic blood splatter with organic irregular edges,
 * satellite droplets, and gravity-fed drip trails.
 */
function BloodSplatter({ className, style, progress, from = 0, to = 1, variant = 0 }) {
  const opacity = useTransform(progress, [from, from + 0.02, to], [0, 1, 1]);
  const scale = useTransform(progress, [from, from + 0.04, to], [0.6, 1.08, 1]);
  const clipY = useTransform(progress, [from, to], [0, 100]);
  const clipPath = useTransform(clipY, (v) => `inset(0 0 ${100 - v}% 0)`);

  const splatters = [
    // Variant 0 — large irregular impact splatter
    (
      <svg key="splat-0" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Main impact body — irregular organic blob */}
        <path
          d="M150 40C168 38 195 48 210 72C225 96 228 118 218 138C232 132 248 140 252 158C256 176 244 192 228 196C236 208 234 228 222 240C210 252 192 254 180 246C184 268 178 288 164 296C150 304 132 300 122 288C112 300 94 306 80 298C66 290 60 272 64 254C48 262 30 256 22 242C14 228 18 210 32 200C20 194 12 178 16 162C20 146 36 136 52 138C44 120 48 98 62 82C76 66 98 58 116 64C112 50 122 42 150 40Z"
          fill="url(#splat-grad-0)"
        />
        {/* Internal darker veins / pooling */}
        <path
          d="M140 80C155 78 180 88 190 108C200 128 196 148 184 160C172 172 154 174 142 164C130 154 128 136 138 120C132 112 134 88 140 80Z"
          fill="#3D0000"
          opacity="0.45"
        />
        <path
          d="M100 140C115 132 135 138 142 154C149 170 142 188 126 194C110 200 92 192 86 176C80 160 88 144 100 140Z"
          fill="#2D0000"
          opacity="0.35"
        />
        {/* Satellite droplets scattered around impact */}
        <ellipse cx="42" cy="60" rx="8" ry="10" transform="rotate(-20 42 60)" fill="#8B0000" opacity="0.7" />
        <circle cx="260" cy="80" r="5" fill="#6B0000" opacity="0.55" />
        <ellipse cx="270" cy="170" rx="7" ry="5" fill="#7B0000" opacity="0.5" />
        <circle cx="18" cy="170" r="6" fill="#8B0000" opacity="0.6" />
        <circle cx="55" cy="38" r="4" fill="#9B0000" opacity="0.5" />
        <circle cx="240" cy="55" r="3" fill="#6B0000" opacity="0.45" />
        <ellipse cx="30" cy="240" rx="5" ry="6" fill="#7B0000" opacity="0.5" />
        <circle cx="265" cy="225" r="4" fill="#6B0000" opacity="0.4" />
        {/* Tiny spatter dots */}
        <circle cx="280" cy="110" r="2" fill="#8B0000" opacity="0.5" />
        <circle cx="10" cy="130" r="2.5" fill="#7B0000" opacity="0.45" />
        <circle cx="245" cy="250" r="2" fill="#6B0000" opacity="0.35" />
        <circle cx="48" cy="280" r="1.8" fill="#8B0000" opacity="0.4" />
        <circle cx="200" cy="40" r="2.2" fill="#9B0000" opacity="0.45" />
        {/* Gravity drip trails */}
        <path d="M110 290C108 310 106 340 104 370C103 385 105 395 104 400" stroke="url(#drip-grad-0)" strokeWidth="5" strokeLinecap="round" />
        <path d="M160 296C161 318 163 348 162 378C162 390 161 400 161 400" stroke="url(#drip-grad-0)" strokeWidth="4" strokeLinecap="round" />
        <path d="M80 270C78 292 75 320 74 355C73 375 74 390 73 400" stroke="url(#drip-grad-0)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M200 248C202 270 204 300 203 340C202 365 203 385 202 400" stroke="url(#drip-grad-0)" strokeWidth="3" strokeLinecap="round" />
        {/* Drip bulges — thicker pools at base of drips */}
        <ellipse cx="104" cy="370" rx="4" ry="6" fill="#7B0000" opacity="0.6" />
        <ellipse cx="162" cy="378" rx="3.5" ry="5" fill="#6B0000" opacity="0.55" />
        <ellipse cx="73" cy="355" rx="3" ry="5" fill="#8B0000" opacity="0.5" />
        <defs>
          <radialGradient id="splat-grad-0" cx="0.5" cy="0.42" r="0.55" fx="0.45" fy="0.38">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="30%" stopColor="#B91C1C" />
            <stop offset="60%" stopColor="#7F1D1D" />
            <stop offset="100%" stopColor="#450A0A" />
          </radialGradient>
          <linearGradient id="drip-grad-0" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#991B1B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#450A0A" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    ),
    // Variant 1 — smeared impact with directional spread
    (
      <svg key="splat-1" viewBox="0 0 260 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          d="M130 30C155 28 185 42 200 68C215 94 212 122 198 142C214 148 224 168 218 188C212 208 192 218 172 212C176 232 168 254 150 264C132 274 110 268 98 252C84 264 62 268 46 256C30 244 26 222 36 206C22 200 14 182 20 166C26 150 44 142 60 148C52 128 56 104 72 86C88 68 112 60 130 68C124 50 130 34 130 30Z"
          fill="url(#splat-grad-1)"
        />
        <path
          d="M120 70C140 68 160 82 168 102C176 122 168 142 148 150C128 158 108 148 100 128C92 108 100 82 120 70Z"
          fill="#2D0000"
          opacity="0.4"
        />
        {/* Directional spatter (like a slap) */}
        <ellipse cx="230" cy="90" rx="10" ry="5" transform="rotate(-30 230 90)" fill="#8B0000" opacity="0.6" />
        <ellipse cx="238" cy="120" rx="6" ry="3.5" transform="rotate(-25 238 120)" fill="#7B0000" opacity="0.5" />
        <circle cx="245" cy="150" r="4" fill="#6B0000" opacity="0.45" />
        <circle cx="20" cy="100" r="5" fill="#8B0000" opacity="0.55" />
        <circle cx="15" cy="185" r="3.5" fill="#7B0000" opacity="0.4" />
        <circle cx="242" cy="180" r="2.8" fill="#6B0000" opacity="0.35" />
        <circle cx="8" cy="145" r="2" fill="#9B0000" opacity="0.4" />
        {/* Drip trails */}
        <path d="M95 260C93 285 90 320 89 350C88 358 89 360 89 360" stroke="url(#drip-grad-1)" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M145 268C146 295 148 330 147 355C147 358 147 360 147 360" stroke="url(#drip-grad-1)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M60 248C58 274 55 310 54 345C53 355 54 360 54 360" stroke="url(#drip-grad-1)" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="89" cy="350" rx="3.5" ry="5.5" fill="#7B0000" opacity="0.55" />
        <ellipse cx="147" cy="355" rx="3" ry="4.5" fill="#6B0000" opacity="0.5" />
        <defs>
          <radialGradient id="splat-grad-1" cx="0.48" cy="0.4" r="0.52" fx="0.42" fy="0.35">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="25%" stopColor="#B91C1C" />
            <stop offset="55%" stopColor="#7F1D1D" />
            <stop offset="100%" stopColor="#3B0000" />
          </radialGradient>
          <linearGradient id="drip-grad-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#991B1B" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#450A0A" stopOpacity="0.25" />
          </linearGradient>
        </defs>
      </svg>
    ),
  ];

  return (
    <motion.div className={className} style={{ opacity, scale, clipPath, ...style }}>
      {splatters[variant % splatters.length]}
    </motion.div>
  );
}

/**
 * Realistic bloody handprint with anatomically proportioned fingers,
 * palm creases, fingerprint texture hints, and dripping blood.
 */
function BloodyHandprint({ className, style, progress, from = 0, to = 1, side = 'left' }) {
  const opacity = useTransform(progress, [from, from + 0.03, to], [0, 0.9, 0.9]);
  const xStart = side === 'left' ? -80 : 80;
  const x = useTransform(progress, [from, from + 0.06, to], [xStart, 0, 0]);
  const rotate = side === 'left' ? -12 : 12;

  return (
    <motion.div className={className} style={{ opacity, x, rotate, ...style }}>
      <svg viewBox="0 0 220 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* ── PALM ── */}
        <path
          d="M70 175C65 160 58 140 60 120C62 108 68 102 76 106C84 110 82 125 82 140
             C80 125 76 105 78 85C80 65 88 58 96 64C104 70 100 92 98 115L96 140
             C98 115 102 85 108 65C114 45 126 48 126 64C126 80 118 110 116 140
             C120 118 128 88 136 72C144 56 156 62 152 80C148 98 136 130 128 150
             C136 140 148 128 158 125C168 122 172 134 164 148C156 162 142 175 132 180
             C145 174 158 168 164 176C170 184 158 194 148 196L86 215C72 220 62 208 62 192C62 184 66 178 70 175Z"
          fill="url(#hand-grad-main)"
        />
        {/* ── Palm crease lines ── */}
        <path d="M72 170C85 158 100 155 118 160" stroke="#3D0000" strokeWidth="1.2" opacity="0.35" strokeLinecap="round" />
        <path d="M68 185C82 175 98 172 122 178" stroke="#3D0000" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
        <path d="M80 150C92 145 106 148 115 155" stroke="#2D0000" strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />
        {/* ── Fingertip blood pools ── */}
        <ellipse cx="76" cy="104" rx="7" ry="5" transform="rotate(-10 76 104)" fill="#C1121F" opacity="0.65" />
        <ellipse cx="96" cy="62" rx="6" ry="4.5" transform="rotate(-5 96 62)" fill="#B91C1C" opacity="0.6" />
        <ellipse cx="124" cy="46" rx="6.5" ry="4.5" fill="#C1121F" opacity="0.65" />
        <ellipse cx="152" cy="60" rx="6" ry="5" transform="rotate(10 152 60)" fill="#B91C1C" opacity="0.6" />
        <ellipse cx="162" cy="122" rx="5.5" ry="4" transform="rotate(15 162 122)" fill="#C1121F" opacity="0.55" />
        {/* ── Fingerprint texture — subtle arcs on fingertips ── */}
        <path d="M73 100C76 97 80 98 80 102" stroke="#5B0000" strokeWidth="0.5" opacity="0.3" />
        <path d="M93 60C96 57 100 58 100 62" stroke="#5B0000" strokeWidth="0.5" opacity="0.3" />
        <path d="M121 44C124 41 128 42 128 46" stroke="#5B0000" strokeWidth="0.5" opacity="0.3" />
        <path d="M149 58C152 55 156 56 156 60" stroke="#5B0000" strokeWidth="0.5" opacity="0.3" />
        {/* ── Smear marks from sliding ── */}
        <path
          d="M85 215C83 225 80 238 78 248C76 258 78 262 80 264"
          stroke="#7F1D1D"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M110 212C112 224 115 238 114 250C113 260 112 264 112 266"
          stroke="#7F1D1D"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.25"
        />
        {/* ── Drip trails from palm base ── */}
        <path d="M82 215C80 235 77 265 75 295C74 308 75 315 74 320" stroke="url(#hand-drip)" strokeWidth="5" strokeLinecap="round" />
        <path d="M105 212C106 238 108 270 107 300C107 310 106 318 106 320" stroke="url(#hand-drip)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M125 208C128 232 130 265 129 295C128 310 129 318 128 320" stroke="url(#hand-drip)" strokeWidth="2.8" strokeLinecap="round" />
        {/* Drip end pools */}
        <ellipse cx="74" cy="295" rx="4" ry="6" fill="#6B0000" opacity="0.5" />
        <ellipse cx="107" cy="300" rx="3.5" ry="5" fill="#5B0000" opacity="0.45" />
        <ellipse cx="129" cy="295" rx="3" ry="4.5" fill="#6B0000" opacity="0.4" />
        {/* ── Edge spatter from impact ── */}
        <circle cx="52" cy="150" r="3" fill="#8B0000" opacity="0.4" />
        <circle cx="180" cy="145" r="2.5" fill="#7B0000" opacity="0.35" />
        <circle cx="45" cy="180" r="2" fill="#8B0000" opacity="0.35" />
        <circle cx="175" cy="175" r="2.5" fill="#6B0000" opacity="0.3" />
        <circle cx="58" cy="115" r="1.8" fill="#9B0000" opacity="0.3" />
        <circle cx="172" cy="105" r="2" fill="#7B0000" opacity="0.28" />
        <defs>
          <radialGradient id="hand-grad-main" cx="0.48" cy="0.45" r="0.5" fx="0.44" fy="0.4">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="30%" stopColor="#B91C1C" />
            <stop offset="55%" stopColor="#881A1B" />
            <stop offset="100%" stopColor="#450A0A" />
          </radialGradient>
          <linearGradient id="hand-drip" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#991B1B" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#6B0000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#450A0A" stopOpacity="0.15" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

/**
 * BloodEffects — Fixed overlay with scroll-triggered blood stains
 * and handprints placed at strategic viewport positions.
 * All elements are pointer-events-none.
 */
export default function BloodEffects() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {/* ── Blood splatter — top-right corner, early scroll ── */}
      <BloodSplatter
        progress={scrollYProgress}
        from={0.04}
        to={0.18}
        variant={0}
        className="absolute -top-6 right-2 sm:right-10 w-32 sm:w-48 h-48 sm:h-64 opacity-80"
        style={{ transformOrigin: 'top right' }}
      />

      {/* ── Bloody handprint — left edge, mid-scroll ── */}
      <BloodyHandprint
        progress={scrollYProgress}
        from={0.18}
        to={0.35}
        side="left"
        className="absolute top-[32%] -left-3 sm:left-2 w-28 sm:w-40 h-44 sm:h-56"
      />

      {/* ── Smaller blood splat — bottom-left, deeper scroll ── */}
      <BloodSplatter
        progress={scrollYProgress}
        from={0.4}
        to={0.55}
        variant={1}
        className="absolute bottom-[32%] left-0 sm:left-8 w-24 sm:w-32 h-36 sm:h-44 opacity-70"
        style={{ transformOrigin: 'center left' }}
      />

      {/* ── Bloody handprint — right edge, deep scroll ── */}
      <BloodyHandprint
        progress={scrollYProgress}
        from={0.52}
        to={0.68}
        side="right"
        className="absolute top-[58%] -right-3 sm:right-4 w-24 sm:w-36 h-40 sm:h-52"
      />

      {/* ── Final large blood splatter — bottom-right, near end ── */}
      <BloodSplatter
        progress={scrollYProgress}
        from={0.72}
        to={0.88}
        variant={0}
        className="absolute bottom-12 right-2 sm:right-14 w-28 sm:w-40 h-40 sm:h-52 opacity-75"
        style={{ transformOrigin: 'bottom right' }}
      />
    </div>
  );
}
