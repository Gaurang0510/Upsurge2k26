import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import TeamSection from '../../components/team/TeamSection.jsx';
import { teamDepartments } from '../../data/team/index.js';

export default function Team() {
  useDocumentTitle('Team');

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Personnel Files"
        title="The Task Force"
        description="Meet the operatives running UPSURGE 2K26 — the people who make the case happen."
      />

      <div className="mt-14">
        {teamDepartments.map((department) => (
          <TeamSection key={department.slug} department={department} />
        ))}
      </div>
    </div>
  );
}
