export default function Logo({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1" y="1" width="46" height="46" stroke="#F5C518" strokeWidth="2" />
      {/* fingerprint-style arcs */}
      <path d="M24 10a14 14 0 0 0-14 14" stroke="#F5C518" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 14a10 10 0 0 0-10 10" stroke="#DCD3B8" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 18a6 6 0 0 0-6 6" stroke="#2FEA8C" strokeWidth="2" strokeLinecap="round" />
      {/* circuit node lines crossing it */}
      <path d="M24 24h14M24 24v14" stroke="#E23744" strokeWidth="2" strokeLinecap="round" />
      <circle cx="38" cy="24" r="2" fill="#E23744" />
      <circle cx="24" cy="38" r="2" fill="#E23744" />
      <circle cx="24" cy="24" r="3" fill="#F5C518" />
    </svg>
  );
}
