export default function EventFilterTabs({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter events by category">
      {categories.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category)}
            className={`border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
              isActive
                ? 'border-evidence bg-evidence text-case-black'
                : 'border-white/10 text-steel hover:border-evidence/40 hover:text-evidence'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
