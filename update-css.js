const fs = require('fs');
const file = 'frontend/src/pages/Hackathon/hackathon.css';
let css = fs.readFileSync(file, 'utf8');

// Remove .hackathon-grid-bg
css = css.replace(/\.hackathon-grid-bg,\n/, '');
css = css.replace(/\.hackathon-grid-bg\s*\{[\s\S]*?\n\}\n/, '');

// Remove .hackathon-track-grid
css = css.replace(/\.hackathon-track-grid\s*\{[\s\S]*?\n\}\n/, '');

// Remove .hackathon-console and its children
css = css.replace(/\.hackathon-console\s*\{[\s\S]*?\n\}\n/, '');
css = css.replace(/\.hackathon-console::before,\n\.hackathon-console::after\s*\{[\s\S]*?\n\}\n/, '');
css = css.replace(/\.hackathon-console::after\s*\{[\s\S]*?\n\}\n/, '');
css = css.replace(/\.hackathon-console-ring\s*\{[\s\S]*?\n\}\n/, '');
css = css.replace(/\.hackathon-console-ring-one\s*\{[\s\S]*?\n\}\n/, '');
css = css.replace(/\.hackathon-console-ring-two\s*\{[\s\S]*?\n\}\n/, '');
css = css.replace(/\.hackathon-console-ring-three\s*\{[\s\S]*?\n\}\n/, '');
css = css.replace(/\.hackathon-console-core\s*\{[\s\S]*?\n\}\n/, '');
css = css.replace(/\.hackathon-console-label\s*\{[\s\S]*?\n\}\n/, '');
css = css.replace(/\.hackathon-console-matrix\s*\{[\s\S]*?\n\}\n/, '');
css = css.replace(/\.hackathon-console-matrix span\s*\{[\s\S]*?\n\}\n/, '');
css = css.replace(/\.hackathon-console-matrix span:nth-child\(2n\)\s*\{[\s\S]*?\n\}\n/, '');
css = css.replace(/\.hackathon-console-matrix span:nth-child\(3n\)\s*\{[\s\S]*?\n\}\n/, '');
css = css.replace(/\.hackathon-console-stack\s*\{[\s\S]*?\n\}\n/, '');
css = css.replace(/\.hackathon-console-chip\s*\{[\s\S]*?\n\}\n/, '');
css = css.replace(/\.hackathon-console-footer\s*\{[\s\S]*?\n\}\n/, '');

// Remove console media queries content
css = css.replace(/\.hackathon-console\s*\{\s*min-height:[^\}]*\}\s*/, '');
css = css.replace(/\.hackathon-console-core\s*\{\s*transform:[^\}]*\}\s*/, '');
css = css.replace(/\.hackathon-console-footer,\n\s*\.hackathon-track-footer\s*\{\s*flex-direction:[^\}]*\}\s*/, '.hackathon-track-footer {\n    flex-direction: column;\n  }\n');
css = css.replace(/\.hackathon-console-ring-one,\n\s*\.hackathon-console-ring-two,\n\s*\.hackathon-console-ring-three,\n\s*\.hackathon-console-matrix span\s*\{\s*animation:[^\}]*\}\s*/, '');

const newCSS = `
/* Ambient Orbs */
.ambient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 20s infinite ease-in-out;
  pointer-events: none;
  z-index: 0;
}
.ambient-orb-1 { width: 400px; height: 400px; background: rgba(47, 234, 140, 0.15); top: -10%; left: -10%; }
.ambient-orb-2 { width: 500px; height: 500px; background: rgba(226, 55, 68, 0.1); bottom: -20%; right: -10%; animation-delay: -5s; }
.ambient-orb-3 { width: 300px; height: 300px; background: rgba(245, 197, 24, 0.1); top: 40%; left: 60%; animation-delay: -10s; }

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

/* Cyber Core */
.cyber-core-container { position: relative; width: 340px; height: 340px; display: flex; align-items: center; justify-content: center; }
.cyber-core-ring { position: absolute; border-radius: 50%; border: 1px solid transparent; transform-style: preserve-3d; }
.cyber-outer-ring { width: 100%; height: 100%; border-top-color: rgba(47, 234, 140, 0.5); border-bottom-color: rgba(47, 234, 140, 0.2); animation: spin 12s linear infinite; }
.cyber-middle-ring { width: 75%; height: 75%; border-left-color: rgba(245, 197, 24, 0.6); border-right-color: rgba(245, 197, 24, 0.2); animation: spin-reverse 8s linear infinite; }
.cyber-inner-ring { width: 50%; height: 50%; border: 2px dashed rgba(226, 55, 68, 0.8); animation: spin 20s linear infinite; }
.cyber-core-glow { position: absolute; width: 60%; height: 60%; background: radial-gradient(circle, rgba(47, 234, 140, 0.2) 0%, transparent 70%); filter: blur(20px); animation: pulse-glow 4s ease-in-out infinite; }
.cyber-core-center { position: relative; z-index: 10; text-align: center; display: flex; flex-direction: column; gap: 0.5rem; }
.cyber-core-text { font-family: "JetBrains Mono", monospace; font-size: 0.85rem; letter-spacing: 0.3em; color: #8a8f8c; }
.cyber-core-status { font-family: "Bebas Neue", sans-serif; font-size: 2.5rem; letter-spacing: 0.1em; text-shadow: 0 0 10px rgba(226, 55, 68, 0.8); }
.blink-text { animation: blink 2s infinite; }
.cyber-particles .particle { position: absolute; width: 4px; height: 4px; background: #2fea8c; border-radius: 50%; box-shadow: 0 0 10px #2fea8c; }
.cyber-particles .p-1 { top: 10%; left: 20%; animation: float 6s infinite; }
.cyber-particles .p-2 { top: 80%; right: 20%; animation: float 8s infinite -2s; }
.cyber-particles .p-3 { bottom: 10%; left: 30%; animation: float 7s infinite -4s; }
.cyber-particles .p-4 { top: 30%; right: 10%; animation: float 5s infinite -1s; }

@keyframes spin { 100% { transform: rotate(360deg); } }
@keyframes spin-reverse { 100% { transform: rotate(-360deg); } }
@keyframes pulse-glow { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
`;

fs.writeFileSync(file, css + newCSS);
