import { motion } from 'framer-motion';

const Waveform = () => (
  <div className="flex items-end gap-[3px] h-14">
    {[4, 8, 5, 12, 7, 10, 4, 11, 6, 9, 5, 13, 7, 8, 4].map((h, i) => (
      <motion.div
        key={i}
        animate={{ scaleY: [1, 0.3 + Math.random() * 0.7, 1] }}
        transition={{
          duration: 0.7 + (i % 5) * 0.15,
          repeat: Infinity,
          delay: i * 0.08,
          ease: 'easeInOut',
        }}
        className="w-[3px] rounded-full bg-emerald-400 origin-bottom"
        style={{ height: `${h * 4}px` }}
      />
    ))}
  </div>
);

const InviteMockup = () => (
  <div className="space-y-3">
    <div className="rounded-lg border border-white/10 bg-black/60 px-4 py-3">
      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1.5">Private room code</p>
      <p className="text-2xl font-mono font-bold text-white tracking-[0.2em]">PRK-4829</p>
    </div>
    <div className="flex gap-2">
      {['Maya', 'Dev', 'Raj'].map((name) => (
        <div key={name} className="flex-1 rounded-md border border-white/10 bg-white/[0.04] py-2 text-center">
          <p className="text-[10px] text-white/40">{name}</p>
          <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-emerald-400 mx-auto" />
        </div>
      ))}
      <div className="flex-1 rounded-md border border-dashed border-white/10 py-2 text-center">
        <p className="text-[10px] text-white/20">+ Invite</p>
      </div>
    </div>
  </div>
);

const ActionTimer = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs text-white/40">Your turn</span>
      <span className="text-xs font-mono text-amber-400">0:12</span>
    </div>
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
      <motion.div
        animate={{ width: ['100%', '0%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-amber-400"
      />
    </div>
    <div className="flex gap-2 mt-3">
      {['Fold', 'Check', 'Raise'].map((action, i) => (
        <motion.div
          key={action}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
          className={`flex-1 rounded border py-2 text-center text-[11px] font-medium ${
            action === 'Raise'
              ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300'
              : 'border-white/10 bg-white/[0.03] text-white/50'
          }`}
        >
          {action}
        </motion.div>
      ))}
    </div>
  </div>
);

const features = [
  {
    label: 'Real-time Voice',
    title: 'Hear the table breathe.',
    desc: 'Spatial voice isolates each player at their seat. You hear who talks, not a conference blur.',
    illustration: <Waveform />,
    accent: 'emerald',
  },
  {
    label: 'Private Tables',
    title: 'Invite your crew, nobody else.',
    desc: 'One code, your people. Set custom blinds, time banks, and rules before anyone sits down.',
    illustration: <InviteMockup />,
    accent: 'violet',
  },
  {
    label: 'Fast Action',
    title: 'Zero wait. Zero lag.',
    desc: 'Sub-50ms action relay. The table reacts the moment you do — no spinner, no delay.',
    illustration: <ActionTimer />,
    accent: 'amber',
  },
];

const accentMap: Record<string, string> = {
  emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/[0.07]',
  violet: 'text-violet-400 border-violet-500/20 bg-violet-500/[0.07]',
  amber: 'text-amber-400 border-amber-500/20 bg-amber-500/[0.07]',
};

const glowMap: Record<string, string> = {
  emerald: 'bg-emerald-500/10',
  violet: 'bg-violet-500/10',
  amber: 'bg-amber-500/10',
};

export const FeaturesSection = () => (
  <section id="features" className="relative border-b border-white/[0.07] bg-[#080808] px-6 py-28 lg:px-8">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(16,185,129,0.06),transparent_55%)]" />

    <div className="relative z-10 mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="mb-16 text-center"
      >
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400">
          Why it's different
        </p>
        <h2 className="text-4xl font-medium tracking-tight text-white sm:text-5xl">
          Built for the vibe, not just the game.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#0f0f0f] p-7 hover:border-white/15 transition-all duration-300"
          >
            <div className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${glowMap[f.accent]}`} />

            <span className={`mb-6 inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${accentMap[f.accent]}`}>
              {f.label}
            </span>

            <div className="mb-6 min-h-[80px] flex items-center">
              {f.illustration}
            </div>

            <h3 className="mb-2 text-xl font-medium text-white">{f.title}</h3>
            <p className="text-[0.9rem] leading-relaxed text-white/45">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
