const MESSAGES = [
  'SYSTEM STATUS: BREACH DETECTED',
  'FIREWALL INTEGRITY: 12%',
  'UNKNOWN ACTOR ACCESSING MAINFRAME',
  'CASE FILE UPSURGE-2K26 :: OPEN',
  'TRACE ROUTE IN PROGRESS...',
  'ALL OPERATIVES REPORT TO GRID',
];

export default function StatusTicker() {
  const line = MESSAGES.join('   ///   ');

  return (
    <div className="overflow-hidden border-y border-evidence/20 bg-ink py-2" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-mono text-xs uppercase tracking-[0.3em] text-terminal">
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  );
}
