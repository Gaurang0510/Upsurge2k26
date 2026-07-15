export default function TrackCard({ track }) {
  return (
    <div className="file-card p-6">
      <div className="noise-overlay" />
      <span className="relative font-mono text-xs tracking-widest text-breach">{track.code}</span>
      <h4 className="relative mt-2 font-display text-2xl tracking-wide text-paper">{track.name}</h4>
      <p className="relative mt-3 text-sm text-steel">{track.brief}</p>
    </div>
  );
}
