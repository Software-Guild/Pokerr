export type CommunityCardProps = {
  rank: string;
  suit: string;
  red?: boolean;
};

export const CommunityCard = ({ rank, suit, red = false }: CommunityCardProps) => (
  <div
    className={`flex h-[58px] w-10 flex-col justify-between rounded bg-zinc-50 p-1.5 font-serif shadow-md shadow-black/50 ${
      red ? 'text-red-600' : 'text-zinc-900'
    }`}
  >
    <span className="text-xs font-bold leading-none">{rank}</span>
    <span className="self-center text-base leading-none">{suit}</span>
    <span className="rotate-180 self-end text-xs font-bold leading-none">{rank}</span>
  </div>
);
