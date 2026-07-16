const fs = require('fs');
const file = 'frontend/src/pages/Hackathon/hackathon.css';
let css = fs.readFileSync(file, 'utf8');

// 1. Remove hackathon-page background
css = css.replace(/\.hackathon-page\s*\{[\s\S]*?\n\}\n/, '.hackathon-page {\n  position: relative;\n}\n');
css = css.replace(/\.hackathon-page::before\s*\{[\s\S]*?\n\}\n/, '');
css = css.replace(/\.hackathon-page > section\s*\{[\s\S]*?\n\}\n/, '');

// 2. Update hackathon-hero with the background and overlay
css = css.replace(/\.hackathon-hero\s*\{[\s\S]*?\n\}\n/, `.hackathon-hero {
  position: relative;
  min-height: 100vh;
  background-image: url('/images/gallery/HOME_background.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: scroll;
  background-repeat: no-repeat;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
}
.hackathon-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(5, 5, 5, 0.9) 0%,
    rgba(5, 5, 5, 0.6) 50%,
    rgba(5, 5, 5, 1) 100%
  );
  pointer-events: none;
  z-index: 0;
}
`);

// 3. Replace all rgba(47, 234, 140) (Green) and rgba(245, 197, 24) (Yellow) with rgba(193, 18, 31) (Crimson Red)
css = css.replace(/rgba\(47,\s*234,\s*140,/g, 'rgba(193, 18, 31,');
css = css.replace(/rgba\(245,\s*197,\s*24,/g, 'rgba(193, 18, 31,');

// 4. Replace #f5c518 (Yellow) and #2fea8c (Green) with #C1121F
css = css.replace(/#f5c518/gi, '#C1121F');
css = css.replace(/#2fea8c/gi, '#C1121F');

// 5. Replace other specific colors in Cyber Core
css = css.replace(/rgba\(120,\s*0,\s*0,/g, 'rgba(120, 0, 0,'); // already red
// Ensure .ambient-orb-2 has red (it was 226, 55, 68 which is blood red) -> change to 120, 0, 0 for variety
css = css.replace(/rgba\(226,\s*55,\s*68,/g, 'rgba(120, 0, 0,');
css = css.replace(/#E23744/gi, '#C1121F'); // wait this is blood red, but just in case it's in css

fs.writeFileSync(file, css);
