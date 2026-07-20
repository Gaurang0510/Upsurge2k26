import ScrollFloat from '../ScrollFloat.jsx';

export default function SectionHeading({ eyebrow, title, description, align = 'left', scrollFloat = false, className = '' }) {
  const alignment = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start';

  return (
    <div className={`flex flex-col gap-3 max-w-3xl ${alignment} ${className}`}>
      {eyebrow && <span className="case-tag">{"//"} {eyebrow}</span>}
      {scrollFloat && typeof title === 'string' ? (
        <ScrollFloat
          containerClassName="!my-0 overflow-visible"
          textClassName="heading-display text-4xl sm:text-5xl uppercase tracking-wide text-white"
          scrollStart="top bottom-=10%"
          scrollEnd="bottom center"
        >
          {title}
        </ScrollFloat>
      ) : (
        <h2 className="heading-display text-4xl sm:text-5xl">{title}</h2>
      )}
      {description && <p className="text-steel text-base sm:text-lg mt-1">{description}</p>}
    </div>
  );
}
