export default function TeamCard({ member }) {
  const hasSocials = member.socials && Object.values(member.socials).some(Boolean);

  return (
    <div className="file-card p-5 text-center">
      <div className="noise-overlay" />
      <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-evidence/40 bg-ink-light">
        <img
          src={member.photo}
          alt={member.name}
          className="h-full w-full object-cover grayscale"
          loading="lazy"
        />
      </div>
      <h4 className="relative mt-4 font-display text-xl tracking-wide text-paper">{member.name}</h4>
      <p className="relative font-mono text-[11px] uppercase tracking-widest text-evidence">{member.role}</p>

      {hasSocials && (
        <div className="relative mt-3 flex justify-center gap-3 font-mono text-[10px] uppercase tracking-widest text-steel">
          {member.socials.linkedin && (
            <a href={member.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-evidence">
              LinkedIn
            </a>
          )}
          {member.socials.github && (
            <a href={member.socials.github} target="_blank" rel="noreferrer" className="hover:text-evidence">
              GitHub
            </a>
          )}
          {member.socials.instagram && (
            <a href={member.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-evidence">
              Instagram
            </a>
          )}
        </div>
      )}
    </div>
  );
}
