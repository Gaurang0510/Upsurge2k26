/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ---- UPSURGE 2K26 :: CASE FILE PALETTE ----
        'case-black': '#0B0D0C', // primary background — the interrogation room
        ink: '#141817', // card / surface background
        'ink-light': '#1C211F', // hover / raised surface
        evidence: '#F5C518', // crime-tape yellow — primary accent
        breach: '#E23744', // alert red — danger, CTAs, "wanted" stamps
        terminal: '#2FEA8C', // hacker-terminal green — cyber/CTF accent
        paper: '#DCD3B8', // manila case-file paper tone (use sparingly, on paper-textured blocks only)
        steel: '#8A8F8C', // muted secondary text
        'steel-dark': '#5C615F',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'], // wanted-poster / stencil headlines
        body: ['"Inter"', 'sans-serif'], // readable body copy
        mono: ['"JetBrains Mono"', 'monospace'], // terminal / data / case numbers
      },
      backgroundImage: {
        noise: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
        tape: 'repeating-linear-gradient(45deg, #F5C518, #F5C518 14px, #0B0D0C 14px, #0B0D0C 28px)',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '20%': { transform: 'translate(-2px,1px)' },
          '40%': { transform: 'translate(2px,-1px)' },
          '60%': { transform: 'translate(-1px,-1px)' },
          '80%': { transform: 'translate(1px,1px)' },
        },
        'redact-out': {
          '0%': { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        scanline: 'scanline 6s linear infinite',
        blink: 'blink 1s steps(1) infinite',
        glitch: 'glitch 0.25s steps(2) infinite',
        marquee: 'marquee 30s linear infinite',
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
