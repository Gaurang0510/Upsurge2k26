import TeamCard from './TeamCard.jsx';

export default function TeamSection({ department }) {
  return (
    <section className="mb-16">
      <div className="mb-6 flex items-center gap-4">
        <h3 className="case-tag text-sm">{"//"} {department.name}</h3>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {department.members.map((member, index) => (
           
          <TeamCard key={`${department.slug}-${index}`} member={member} />
        ))}
      </div>
    </section>
  );
}
