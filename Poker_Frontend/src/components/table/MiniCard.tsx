export const MiniCard = ({ rank, suit, red = false }: { rank: string; suit: string; red?: boolean }) => (
  <div
    className={`flex h-[52px] w-9 flex-col justify-between rounded-md bg-white p-1.5 shadow-lg shadow-black/40 font-serif ${
      red ? 'text-red-600' : 'text-zinc-900'
    }`}
  >
    <span className="text-[10px] font-bold leading-none">{rank}</span>
    <span className="self-center text-sm leading-none">{suit}</span>
    <span className="rotate-180 self-end text-[10px] font-bold leading-none">{rank}</span>
  </div>
);
