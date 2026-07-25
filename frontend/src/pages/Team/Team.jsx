import { Link } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import TeamSection from '../../components/team/TeamSection.jsx';
import Aurora from '../../components/team/Aurora.jsx';
import ScrollFade from '../../components/common/ScrollFade.jsx';
import { teamDepartments } from '../../data/team/index.js';

export default function Team() {
  useDocumentTitle('Team');

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Full-Bleed Top Aurora WebGL Layer (Extends behind navbar & top page header) */}
      <div className="absolute inset-x-0 top-0 h-[800px] z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-75">
          <Aurora
            colorStops={['#E23744', '#700018', '#000000']}
            amplitude={1.6}
            blend={0.7}
            speed={1.2}
          />
        </div>
        {/* Soft gradient mask to blend seamless transition into page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0a0a0a]" />
      </div>

      {/* Main Page Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-36 pb-28 sm:pt-44 sm:pb-36 sm:px-6 lg:px-8">
        <ScrollFade direction="up">
          <SectionHeading
            eyebrow="Personnel Files"
            title="The Task Force"
            description="Meet the operatives running UPSURGE 2K26 — the people who make the case happen."
            scrollFloat={true}
          />
        </ScrollFade>

        {/* Team Departments Grid under investigation */}
        <div className="under-investigation-wrapper mt-20">
          <div className="under-investigation-blur space-y-24 sm:space-y-36">
            {teamDepartments.map((department) => (
              <ScrollFade key={department.slug} direction="up">
                <TeamSection department={department} />
              </ScrollFade>
            ))}
          </div>

          {/* Under Investigation Overlay */}
          <div className="under-investigation-overlay">
            <div className="under-investigation-badge">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <h4 className="under-investigation-title">[ Registry Lock ]</h4>
              <p className="under-investigation-text">
                Operative personnel logs are undergoing security clearance and will display soon. The active Smackathon page is fully functional for track details and registrations.
              </p>
              <Link
                to="/hackathon"
                onClick={(e) => e.stopPropagation()}
                className="mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-red-500/50 bg-red-950/20 text-red-400 font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all duration-300 rounded cursor-pointer"
              >
                <span>ACCESS ACTIVE SMACKATHON</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


