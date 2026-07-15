import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo.jsx';
import { siteConfig } from '../../data/site.js';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
      isActive ? 'text-evidence' : 'text-paper/80 hover:text-evidence'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-case-black/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
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

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 bg-case-black md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
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
        </div>
      )}
    </header>
  );
}
