export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const alignment = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start';

  return (
    <div className={`flex flex-col gap-3 max-w-2xl ${alignment}`}>
      {eyebrow && <span className="case-tag">{"//"} {eyebrow}</span>}
      <h2 className="heading-display text-4xl sm:text-5xl">{title}</h2>
      {description && <p className="text-steel text-base sm:text-lg">{description}</p>}
    </div>
  );
}
