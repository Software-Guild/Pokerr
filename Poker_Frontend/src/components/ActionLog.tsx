import React, { useEffect, useRef } from 'react';

export interface LogEntry {
  id: string;
  actor: string;
  message: string;
  tone?: 'dealer' | 'fold' | 'bet' | 'player' | 'hero';
}

export default function ActionLog({ entries }: { entries: LogEntry[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-1.5 p-1 font-sans text-xs">
      {entries.map((log) => (
        <div
          key={log.id}
          className="w-full min-w-0 max-w-full rounded-lg border border-white/[0.04] bg-white/[0.02] p-2 leading-relaxed text-neutral-300"
          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal' }}
        >
          <span className="font-semibold text-white/90 mr-1.5 inline">
            {log.actor}:
          </span>
          <span className="text-neutral-400 inline">
            {log.message}
          </span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}