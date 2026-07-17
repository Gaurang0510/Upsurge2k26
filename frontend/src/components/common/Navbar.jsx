import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo.jsx';
import { siteConfig } from '../../data/site.js';
import GlassSurface from './GlassSurface.jsx';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
      isActive ? 'text-evidence' : 'text-paper/80 hover:text-evidence'
    }`;

  return (
    <header className="sticky top-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={16}
        backgroundOpacity={0}
        borderWidth={0.05}
        brightness={50}
        opacity={0.95}
        blur={0}
        displace={6}
        saturation={1.2}
        distortionScale={-140}
        redOffset={4}
        greenOffset={12}
        blueOffset={20}
        className="mx-auto max-w-[85rem]"
      >
        <nav className="w-full flex items-center justify-between px-6 py-3">
          <NavLink to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Logo />
            <span className="font-display text-2xl tracking-widest text-paper">
              {siteConfig.shortName}
              <span className="text-evidence">2K26</span>
            </span>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {siteConfig.navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={linkClass} end={link.path === '/'}>
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/events" className="btn-primary">
              Register
            </NavLink>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center border border-white/10 text-evidence md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className="font-mono text-lg">{open ? '×' : '≡'}</span>
          </button>
        </nav>
      </GlassSurface>

      {/* Mobile menu */}
      {open && (
        <div className="mx-auto mt-2 max-w-[85rem]">
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={16}
            backgroundOpacity={0.15}
            className="md:hidden"
          >
            <div className="w-full flex flex-col gap-1 px-6 py-4">
              {siteConfig.navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `border-b border-white/5 py-3 font-mono text-sm uppercase tracking-widest ${
                      isActive ? 'text-evidence' : 'text-paper/80'
                    }`
                  }
                  onClick={() => setOpen(false)}
                  end={link.path === '/'}
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink to="/events" className="btn-primary mt-4 w-full" onClick={() => setOpen(false)}>
                Register
              </NavLink>
            </div>
          </GlassSurface>
        </div>
      )}
    </header>
  );
}
