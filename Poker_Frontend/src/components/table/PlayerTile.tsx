import { Mic } from 'lucide-react';

export const AVATAR_COLORS: Record<string, string> = {
  Maya: '#7c3aed',
  Dev: '#d97706',
  Raj: '#2563eb',
};

export type PlayerTileProps = {
  name: string;
  stack: string;
  status: string;
  className: string;
  bet?: string;
  isTurn?: boolean;
};

export const PlayerTile = ({ name, stack, status, className, bet, isTurn }: PlayerTileProps) => {
  const bg = AVATAR_COLORS[name] ?? '#52525b';
  return (
    <div className={`absolute rounded-lg border bg-[#111]/95 p-3 shadow-2xl shadow-black/60 backdrop-blur-sm ${className}`}>
      <div className="mb-2 flex items-center gap-2">
        <span
          className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
          style={{ backgroundColor: bg }}
        >
          {name[0]}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-white">{name}</p>
          <p className="text-[11px] text-white/40">{stack}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] ${isTurn ? 'text-amber-400 font-medium' : 'text-white/40'}`}>
          {status}
        </span>
        <Mic className="h-3 w-3 text-emerald-400/60" />
      </div>
      {bet && (
        <div className="mt-2 rounded border border-white/10 bg-black/50 px-2 py-1 text-center text-[10px] font-medium text-white/55">
          Raised {bet}
        </div>
      )}
    </div>
  );
};
