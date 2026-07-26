import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { siteConfig } from '../../data/site.js';

const YT_VIDEO_ID = 'R8lHaEZYpCU';

/* ─── tiny animated cursor for the terminal ─── */
function Cursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn(v => !v), 530);
    return () => clearInterval(t);
  }, []);
  return <span style={{ opacity: on ? 1 : 0 }}>▋</span>;
}

export default function Footer() {
  const location = useLocation();
  const isSmackathonPage = location.pathname === '/hackathon' || location.pathname === '/events/operation-breach';

  const [input, setInput] = useState('');
  const [logs, setLogs] = useState([
    { text: '[ UPSURGE-TERM v2.0 — SYSTEM ONLINE ]', cls: 'text-green-400' },
    { text: "  type 'help' for available commands", cls: 'text-green-600' },
  ]);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const run = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const echo = { text: `guest@upsurge:~$ ${input}`, cls: 'text-white/90' };
    let reply;

    switch (cmd) {
      case 'help':
        reply = { text: '  help · status · breach · socials · date · clear', cls: 'text-green-400' };
        break;
      case 'status':
        reply = { text: '  STATUS: NOMINAL — INTRUSION COUNTERMEASURES ACTIVE', cls: 'text-green-400' };
        break;
      case 'breach':
        reply = { text: '  ACCESS GRANTED — WELCOME TO OPERATION BREACH, UPSURGE 2K26', cls: 'text-green-400' };
        break;
      case 'socials':
        reply = { text: `  IG → ${isSmackathonPage ? 'https://www.instagram.com/acm.ycce?igsh=bHFhdjVnYjU5MGU4' : siteConfig.socials.instagram}   LI → ${siteConfig.socials.linkedin}`, cls: 'text-green-400' };
        break;
      case 'date':
        reply = { text: `  ${new Date().toUTCString()}`, cls: 'text-green-400' };
        break;
      case 'clear':
        setLogs([]);
        setInput('');
        return;
      default:
        reply = { text: `  command not found: '${cmd}' — try 'help'`, cls: 'text-red-400' };
    }

    setLogs(prev => [...prev, echo, reply]);
    setInput('');
  };

  return (
    <footer className="relative overflow-hidden border-t-2 border-white/10">

      {/* ── Layer 0 — solid base ── */}
      <div className="absolute inset-0" style={{ zIndex: 0, background: '#060606' }} />

      {/* ── Layer 1 — YouTube hacker video (untouched) ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, opacity: 1 }}>
        <iframe
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 'max(100%, calc(100vh * 16 / 9))',
            height: 'max(100%, calc(100vw * 9 / 16))',
            transform: 'translate(-50%, -50%)',
            border: 'none',
            pointerEvents: 'none',
          }}
          src={`https://www.youtube-nocookie.com/embed/${YT_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${YT_VIDEO_ID}&controls=0&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&modestbranding=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Cyber Background"
        />
      </div>

      {/* ── Layer 2 — dark scrim (light at centre so video shows) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            'linear-gradient(to top, rgba(6,6,6,0.93) 0%, rgba(6,6,6,0.55) 35%, rgba(6,6,6,0.55) 65%, rgba(6,6,6,0.93) 100%)',
        }}
      />

      {/* ══════════════ CONTENT ══════════════ */}
      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-10 sm:px-8 lg:px-10" style={{ zIndex: 3 }}>

        {/* ── TOP: tagline banner ── */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-evidence/80">
            ◈ &nbsp; Department of Computer Science &amp; Engineering — YCCE Nagpur &nbsp; ◈
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-widest text-white lg:text-5xl">
            UPSURGE&nbsp;<span className="text-evidence">2K26</span>
          </h2>
          <p className="mt-2 font-mono text-base text-green-400/90 tracking-wider">
            &ldquo;The system has been compromised.&rdquo;
          </p>
        </div>

        {/* ── MAIN GRID (5 cols) ── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* Col 1-2 — About */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 font-mono text-sm font-semibold uppercase tracking-[0.25em] text-evidence">
              About the Fest
            </h3>
            <p className="font-mono text-sm leading-7 text-white/80">
              UPSURGE 2K26 is the annual techfest of the CSE Department, YCCE — themed around
              <span className="text-green-400 font-semibold"> Crime &amp; Cyber Crime</span>.
              Hackathons, cybersecurity CTFs, esports and 13+ events await.
            </p>
            <p className="mt-3 font-mono text-sm leading-7 text-white/80">
              Organised by <span className="text-white font-semibold">COSMOS</span> &amp;&nbsp;
              <span className="text-white font-semibold">ACM Student Chapter, YCCE</span>.
            </p>

            {/* Social links */}
            <div className="mt-6 flex gap-5">
              <a
                href={isSmackathonPage ? 'https://www.instagram.com/acm.ycce?igsh=bHFhdjVnYjU5MGU4' : siteConfig.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded border border-evidence/40 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-evidence transition-all duration-200 hover:border-evidence hover:bg-evidence/10 hover:text-white"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Instagram
              </a>
              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded border border-white/20 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-white/70 transition-all duration-200 hover:border-white/50 hover:bg-white/5 hover:text-white"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>

            {/* ── Partner / Organiser logos — filling the empty space below social links ── */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-white/35">Organised by</p>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-1.5">
                  <img
                    src="/images/logo/upsurge.png"
                    alt="UPSURGE 2K26"
                    className="h-20 w-20 object-contain"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(193,18,31,0.55))' }}
                  />
                  <span className="font-mono text-xs text-white/50 tracking-widest">UPSURGE</span>
                </div>
                <div className="h-14 w-px bg-white/15 shrink-0" />
                <div className="flex flex-col items-center gap-1.5">
                  <img
                    src="/images/logo/acm logo.png"
                    alt="YCCE ACM Student Chapter"
                    className="h-16 object-contain"
                    style={{ filter: 'brightness(0) invert(1) opacity(0.8)' }}
                  />
                  <span className="font-mono text-xs text-white/50 tracking-widest">ACM</span>
                </div>
                <div className="h-14 w-px bg-white/15 shrink-0" />
                <div className="flex flex-col items-center gap-1.5">
                  <img
                    src="/images/logo/cosmos logo.png"
                    alt="COSMOS — CSE Dept YCCE"
                    className="h-16 w-16 object-contain rounded-full"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.2))' }}
                  />
                  <span className="font-mono text-xs text-white/50 tracking-widest">COSMOS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3 — Navigation */}
          <div>
            <h3 className="mb-4 font-mono text-sm font-semibold uppercase tracking-[0.25em] text-evidence">
              Navigate
            </h3>
            <ul className="space-y-3">
              {siteConfig.navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 font-mono text-sm text-white/75 transition-all duration-200 hover:text-white"
                  >
                    <span className="text-evidence opacity-0 transition-opacity group-hover:opacity-100">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h3 className="mb-4 font-mono text-sm font-semibold uppercase tracking-[0.25em] text-evidence">
              Contact Us
            </h3>
            <address className="not-italic space-y-3">
              <p className="font-mono text-sm leading-6 text-white/80">
                CSE Dept, YCCE College<br />
                Wanadongri, Nagpur — 441110
              </p>
              <p className="font-mono text-sm text-white/80">
                <span className="text-white/50 text-xs block mb-0.5">Email</span>
                <a href={`mailto:${isSmackathonPage ? 'hc.himanshuchavan@gmail.com' : siteConfig.email}`} className="text-green-400 hover:text-white transition-colors text-xs sm:text-sm break-all">
                  {isSmackathonPage ? 'hc.himanshuchavan@gmail.com' : siteConfig.email}
                </a>
              </p>
              <div className="pt-1">
                <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-2">Contacts</p>
                {isSmackathonPage ? (
                  <>
                    <p className="font-mono text-sm text-white/75">
                      <span className="text-white font-bold">Himanshu Chavan</span>
                      <br />
                      <span className="text-white/50 text-xs">ACM Secretary</span>
                      <br />
                      <a href="tel:8149529064" className="text-green-400 hover:text-white transition-colors text-xs">8149529064</a>
                    </p>
                    <p className="font-mono text-sm text-white/75 mt-3">
                      <span className="text-white font-bold">Atul Thakre</span>
                      <br />
                      <span className="text-white/50 text-xs">ACM Chairperson</span>
                      <br />
                      <a href="tel:+918830729062" className="text-green-400 hover:text-white transition-colors text-xs">+91 883 072 9062</a>
                    </p>
                  </>
                ) : (
                  siteConfig.contacts.map((c, index) => (
                    <p key={`${c.name}-${index}`} className="font-mono text-sm text-white/75">
                      {c.name} &mdash; <span className="text-white/50 text-xs">{c.role}</span>
                    </p>
                  ))
                )}
              </div>
            </address>
          </div>

          {/* Col 5 — Terminal */}
          <div>
            <h3 className="mb-4 font-mono text-sm font-semibold uppercase tracking-[0.25em] text-evidence">
              Access Terminal
            </h3>
            <div
              className="rounded-sm border border-green-900/60 bg-black/80 backdrop-blur-md overflow-hidden"
              style={{ boxShadow: '0 0 30px rgba(0,255,70,0.08), inset 0 0 20px rgba(0,0,0,0.5)' }}
            >
              {/* Title bar */}
              <div className="flex items-center gap-1.5 border-b border-green-900/40 bg-green-950/30 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-red-500/80" />
                <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
                <span className="h-2 w-2 rounded-full bg-green-500/80" />
                <span className="ml-2 font-mono text-xs text-green-600">bash — upsurge-term</span>
              </div>
              {/* Log window */}
              <div
                ref={logRef}
                className="h-32 overflow-y-auto p-3 space-y-1 font-mono text-xs leading-5 scrollbar-thin"
              >
                {logs.map((l, i) => (
                  <div key={i} className={l.cls}>{l.text}</div>
                ))}
              </div>
              {/* Input */}
              <form
                onSubmit={run}
                className="flex items-center gap-1.5 border-t border-green-900/30 bg-black/40 px-3 py-2"
              >
                <span className="shrink-0 font-mono text-xs text-green-500">guest@upsurge:~$</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="type a command…"
                  autoComplete="off"
                  spellCheck="false"
                  className="w-full bg-transparent font-mono text-xs text-green-300 caret-green-400 outline-none placeholder:text-green-900"
                />
                <Cursor />
              </form>
            </div>

            {/* Quick stat strip */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                { label: 'Events', value: '13+' },
                { label: 'Theme', value: 'Cyber' },
                { label: 'Venue', value: 'YCCE' },
                { label: 'Year', value: '2026' },
              ].map((s) => (
                <div key={s.label} className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-center">
                  <p className="font-mono text-lg font-bold text-white leading-none">{s.value}</p>
                  <p className="font-mono text-xs text-white/40 uppercase tracking-widest mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="my-10 border-t border-white/10" />

        {/* ── BOTTOM BAR ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-white/40">
            © {new Date().getFullYear()} Department of CSE, YCCE. All rights reserved.
          </p>
          <p className="font-mono text-xs text-white/40 text-right hover:text-evidence transition-colors duration-200 cursor-default">
            Built by the ACM Web Team
          </p>
        </div>

      </div>
    </footer>
  );
}
