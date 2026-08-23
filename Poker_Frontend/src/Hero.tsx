import { motion } from 'framer-motion';
import { TablePreview } from './components/table/TablePreview';

const floaters = [
  { suit: '♠', x: '8%',  y: '18%', size: 64, rot: -15, dur: 5.5, delay: 0 },
  { suit: '♥', x: '88%', y: '12%', size: 48, rot: 20,  dur: 6.2, delay: 1 },
  { suit: '♦', x: '5%',  y: '72%', size: 40, rot: 8,   dur: 7.1, delay: 0.8 },
  { suit: '♣', x: '92%', y: '65%', size: 56, rot: -22, dur: 5.8, delay: 0.4 },
  { suit: '♠', x: '50%', y: '88%', size: 36, rot: 12,  dur: 6.6, delay: 1.5 },
  { suit: '♥', x: '75%', y: '82%', size: 44, rot: -8,  dur: 5.2, delay: 0.2 },
];

const FloatingSuit = ({ suit, x, y, size, rot, dur, delay }: typeof floaters[0]) => (
  <motion.div
    animate={{ y: [0, -16, 0], rotate: [rot, rot + 4, rot] }}
    transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
    className="absolute pointer-events-none select-none"
    style={{
      left: x, top: y,
      fontSize: size,
      color: (suit === '♥' || suit === '♦') ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.05)',
      transform: `rotate(${rot}deg)`,
    }}
  >
    {suit}
  </motion.div>
);

export const Hero = () => (
  <section className="relative min-h-[92vh] overflow-hidden border-b border-white/[0.07] bg-[#070707] pt-20">
    {/* Floating suit symbols */}
    {floaters.map((f, i) => <FloatingSuit key={i} {...f} />)}

    {/* Ambient glow */}
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -top-40 left-1/2 h-[520px] w-[680px] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-[130px]" />
      <div className="absolute top-1/2 right-0 h-[300px] w-[400px] rounded-full bg-red-500/[0.04] blur-[100px]" />
    </div>

    <div className="relative z-10 mx-auto grid min-h-[calc(92vh-5rem)] w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-6 flex items-center gap-2"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
            73 games live right now
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 text-[clamp(2.5rem,5.5vw,4.5rem)] font-medium leading-[1.06] tracking-tight text-white"
        >
          Poker nights that feel like everyone's at the table.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 max-w-md text-[1.05rem] leading-relaxed text-white/55"
        >
          Host Texas Hold'em with voice, video seats, and controls that stay out of the way — so the banter doesn't stop.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="bg-red-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(220,38,38,0.2)] transition-all hover:bg-red-500 hover:shadow-[0_0_36px_rgba(220,38,38,0.35)]"
          >
            Start Playing
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="border border-white/15 px-7 py-3.5 text-sm font-medium text-white/65 transition-all hover:border-white/30 hover:text-white"
          >
            See how it works
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 flex items-center gap-6 border-t border-white/[0.07] pt-8"
        >
          <div className="flex -space-x-2.5">
            {['#7c3aed', '#d97706', '#2563eb', '#059669', '#dc2626'].map((c, i) => (
              <span
                key={i}
                className="h-8 w-8 rounded-full border-2 border-[#070707]"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <p className="text-[13px] text-white/45">
            Played by <span className="text-white/70 font-medium">2,400+</span> this week
          </p>
        </motion.div>
      </motion.div>

      <div className="relative">
        {/* Ambient glow behind preview */}
        <div className="absolute -inset-8 rounded-[2rem] bg-emerald-500/[0.06] blur-3xl" />
        <TablePreview />
      </div>
    </div>
  </section>
);
