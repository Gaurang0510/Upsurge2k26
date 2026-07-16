import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import TeamSection from '../../components/team/TeamSection.jsx';
import Aurora from '../../components/team/Aurora.jsx';
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
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Personnel Files"
          title="The Task Force"
          description="Meet the operatives running UPSURGE 2K26 — the people who make the case happen."
        />

        {/* Team Departments Grid */}
        <div className="mt-14">
          {teamDepartments.map((department) => (
            <TeamSection key={department.slug} department={department} />
          ))}
        </div>
      </div>
    </div>
  );
}


