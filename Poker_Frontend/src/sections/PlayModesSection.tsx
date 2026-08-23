import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Video } from 'lucide-react';

type PlayModeCardProps = {
  title: string;
  description: string;
  icon: typeof MessageSquare;
  delay: number;
  isPremium?: boolean;
  tableMeta: string[];
  accent: 'zinc' | 'emerald';
};

const PlayModeCard = ({ title, description, icon: Icon, delay, isPremium, tableMeta, accent }: PlayModeCardProps) => {
  const isLive = accent === 'emerald';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex min-h-[380px] flex-col overflow-hidden rounded-xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
        isLive
          ? 'border-emerald-400/25 bg-[#0e1713] hover:border-emerald-400/45 hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)]'
          : 'border-white/[0.08] bg-[#101010] hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl transition-opacity group-hover:opacity-100 ${
          isLive ? 'bg-emerald-500/10 opacity-60' : 'bg-white/[0.03] opacity-30'
        }`}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-105 ${
              isLive
                ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-300'
                : 'border-white/10 bg-white/[0.04] text-white'
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          {isPremium && (
            <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
              Recommended
            </span>
          )}
        </div>

        <div className="mb-8">
          <h3 className="mb-3 text-2xl font-medium tracking-tight text-white">{title}</h3>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-white/55">{description}</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {tableMeta.map((item) => (
            <div
              key={item}
              className="rounded border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-medium text-white/55"
            >
              {item}
            </div>
          ))}
        </div>

        <button
          className={`mt-auto flex w-full items-center justify-between rounded border px-5 py-3.5 text-sm font-medium transition-all duration-200 ${
            isLive
              ? 'border-emerald-400/35 bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]'
              : 'border-white/15 bg-white text-black hover:bg-zinc-200'
          }`}
        >
          <span>Select Table</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
};

export const PlayModesSection = () => (
  <section id="games" className="relative overflow-hidden border-b border-white/[0.07] bg-[#090b0a] px-6 py-28 lg:px-8">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(16,185,129,0.12),transparent_45%)]" />

    <div className="relative z-10 mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="mb-14 grid gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-end"
      >
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400">
            Game modes
          </p>
          <h2 className="max-w-2xl text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
            Choose a table that matches the room.
          </h2>
        </div>
        <p className="max-w-2xl text-[1.05rem] leading-relaxed text-white/50 lg:ml-auto">
          Start fast with classic chat, or open a video table when the game needs reactions and a little pressure.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <PlayModeCard
          title="Classic Text Chat"
          description="A quiet, quick table for casual hands. Keep the action moving with text chat, table prompts, and simple controls."
          icon={MessageSquare}
          delay={0}
          tableMeta={['2–6 players', 'Fast hands', 'Text chat']}
          accent="zinc"
        />
        <PlayModeCard
          title="Live Video Call"
          description="A more social table with low-latency video and spatial voice — built for reading reactions without cluttering the game."
          icon={Video}
          delay={0.12}
          isPremium
          tableMeta={['2–6 players', 'Voice seats', 'Private room']}
          accent="emerald"
        />
      </div>
    </div>
  </section>
);
