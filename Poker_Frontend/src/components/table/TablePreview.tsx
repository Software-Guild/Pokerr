import { motion } from 'framer-motion';
import { PlayerTile } from './PlayerTile';
import { CommunityCard } from './CommunityCard';
import { HoleCard } from './HoleCard';

export const TablePreview = () => (
  <motion.div
    initial={{ opacity: 0, y: 28, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    className="relative mx-auto w-full max-w-[520px] overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0c] shadow-[0_32px_80px_-8px_rgba(0,0,0,0.95)]"
  >
    {/* Header */}
    <div className="flex items-center justify-between border-b border-white/[0.07] bg-black/60 px-5 py-3.5 backdrop-blur-md">
      <div>
        <p className="text-[13px] font-semibold text-white">Friday Hold'em</p>
        <p className="text-[11px] text-white/35 mt-0.5">$1 / $2 blind · 6 players</p>
      </div>
      <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[11px] font-medium text-emerald-300">Live</span>
      </div>
    </div>

    {/* Table body */}
    <div className="relative h-[380px]">
      {/* Felt */}
      <div className="absolute inset-6 top-8 rounded-[50%] border-[10px] border-[#1a0e07] bg-[#0c3326] shadow-[inset_0_0_50px_rgba(0,0,0,0.7)]" />
      <div className="absolute inset-14 top-16 rounded-[50%] border border-white/[0.07] bg-[#103d2e]" />

      <PlayerTile
        name="Maya"
        stack="$482"
        status="Raised $40"
        isTurn
        bet="$40"
        className="left-3 top-12 w-[118px] border-amber-400/20"
      />
      <PlayerTile
        name="Dev"
        stack="$318"
        status="Thinking..."
        className="right-3 top-12 w-[118px] border-white/10"
      />

      {/* Pot */}
      <div className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/25 mb-1">Pot</p>
        <p className="text-[22px] font-bold text-white leading-none">$124</p>
      </div>

      {/* Community Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="absolute left-1/2 top-[56%] flex -translate-x-1/2 -translate-y-1/2 gap-1.5"
      >
        <CommunityCard rank="A" suit="♠" />
        <CommunityCard rank="K" suit="♥" red />
        <CommunityCard rank="8" suit="♣" />
        <CommunityCard rank="8" suit="♦" red />
        <CommunityCard rank="3" suit="♠" />
      </motion.div>

      {/* You */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <HoleCard />
            <HoleCard />
          </div>
          <div className="rounded-lg border border-emerald-400/25 bg-[#0f0f0f]/95 px-3 py-2.5 shadow-[0_0_14px_rgba(16,185,129,0.08)]">
            <p className="text-[13px] font-semibold text-white">You</p>
            <p className="text-[11px] text-emerald-400 mt-0.5">$640</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button className="rounded border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[10px] font-medium text-white/45 hover:text-white/70 transition-colors">
            Fold
          </button>
          <button className="rounded border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[10px] font-medium text-white/45 hover:text-white/70 transition-colors">
            Call $40
          </button>
          <button className="rounded border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1.5 text-[10px] font-medium text-emerald-300 hover:bg-emerald-500/20 transition-colors">
            Raise
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);
