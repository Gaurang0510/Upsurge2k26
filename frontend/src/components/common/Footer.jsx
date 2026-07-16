import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { siteConfig } from '../../data/site.js';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="font-display text-2xl tracking-widest">
                {siteConfig.shortName}
                <span className="text-evidence">2K26</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-steel">
              {siteConfig.tagline} An {siteConfig.organizer} production. Theme: {siteConfig.theme}.
            </p>
          </div>

          <div>
            <h3 className="case-tag mb-4">Navigation</h3>
            <ul className="space-y-2">
              {siteConfig.navLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-paper/80 hover:text-evidence">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="case-tag mb-4">Find Us</h3>
            <p className="text-sm text-paper/80">{siteConfig.location}</p>
            <p className="mt-3 text-sm text-paper/80">Email: {siteConfig.email}</p>
            <div className="mt-4 flex gap-4 font-mono text-xs uppercase tracking-widest text-evidence">
              <a href={siteConfig.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-white">
                Instagram
              </a>
              <a href={siteConfig.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-steel-dark sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.organizer}. All rights reserved.
          </p>
          <p>Built by the UPSURGE 2K26 Web Team.</p>
        </div>
      </div>
    </footer>
  );
}
