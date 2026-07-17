export default function TrackCard({ track }) {
  return (
    <article className="hackathon-track-card">
      <div className="hackathon-track-grid" aria-hidden="true" />
      <span className="hackathon-track-code">{track.code}</span>
      <h4 className="hackathon-track-title">{track.name}</h4>
      <p className="hackathon-track-brief">{track.brief}</p>
      <div className="hackathon-track-footer">
        <span>Track overview</span>
        <span>Explore more</span>
      </div>
    </article>
  );
}
