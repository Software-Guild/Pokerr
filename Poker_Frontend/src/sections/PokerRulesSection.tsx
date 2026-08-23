import { motion } from 'framer-motion';
import { MiniCard } from '../components/table/MiniCard';

type HandCard = [rank: string, suit: string, red?: boolean];

type HandRanking = {
  rank: string;
  name: string;
  desc: string;
  cards: HandCard[];
  accent: string;
  glow: string;
};

const handRankings: HandRanking[] = [
  {
    rank: '01', name: 'Royal Flush', desc: 'A, K, Q, J, 10 — same suit',
    cards: [['A','♠'], ['K','♠'], ['Q','♠'], ['J','♠'], ['10','♠']],
    accent: 'text-violet-300 border-violet-400/20 bg-violet-400/5',
    glow: 'bg-violet-500/15',
  },
  {
    rank: '02', name: 'Straight Flush', desc: 'Five in sequence, same suit',
    cards: [['9','♥',true], ['8','♥',true], ['7','♥',true], ['6','♥',true], ['5','♥',true]],
    accent: 'text-blue-300 border-blue-400/20 bg-blue-400/5',
    glow: 'bg-blue-500/15',
  },
  {
    rank: '03', name: 'Four of a Kind', desc: 'All four cards of the same rank',
    cards: [['A','♠'], ['A','♥',true], ['A','♦',true], ['A','♣'], ['K','♠']],
    accent: 'text-amber-300 border-amber-400/20 bg-amber-400/5',
    glow: 'bg-amber-500/15',
  },
  {
    rank: '04', name: 'Full House', desc: 'Three of a kind with a pair',
    cards: [['K','♠'], ['K','♥',true], ['K','♦',true], ['Q','♠'], ['Q','♥',true]],
    accent: 'text-orange-300 border-orange-400/20 bg-orange-400/5',
    glow: 'bg-orange-500/15',
  },
  {
    rank: '05', name: 'Flush', desc: 'Any five of the same suit',
    cards: [['A','♥',true], ['J','♥',true], ['8','♥',true], ['5','♥',true], ['2','♥',true]],
    accent: 'text-red-300 border-red-400/20 bg-red-400/5',
    glow: 'bg-red-500/15',
  },
  {
    rank: '06', name: 'Straight', desc: 'Five in sequence, mixed suits',
    cards: [['9','♠'], ['8','♥',true], ['7','♦',true], ['6','♣'], ['5','♠']],
    accent: 'text-emerald-300 border-emerald-400/20 bg-emerald-400/5',
    glow: 'bg-emerald-500/15',
  },
  {
    rank: '07', name: 'Three of a Kind', desc: 'Three cards of the same rank',
    cards: [['Q','♠'], ['Q','♥',true], ['Q','♦',true], ['8','♣'], ['3','♠']],
    accent: 'text-teal-300 border-teal-400/20 bg-teal-400/5',
    glow: 'bg-teal-500/15',
  },
  {
    rank: '08', name: 'Two Pair', desc: 'Two different pairs',
    cards: [['J','♠'], ['J','♥',true], ['7','♦',true], ['7','♣'], ['A','♠']],
    accent: 'text-cyan-300 border-cyan-400/20 bg-cyan-400/5',
    glow: 'bg-cyan-500/15',
  },
  {
    rank: '09', name: 'One Pair', desc: 'Two cards of the same rank',
    cards: [['10','♠'], ['10','♥',true], ['A','♣'], ['7','♦',true], ['2','♠']],
    accent: 'text-white/60 border-white/10 bg-white/[0.03]',
    glow: 'bg-white/5',
  },
  {
    rank: '10', name: 'High Card', desc: 'Highest card plays',
    cards: [['A','♠'], ['K','♥',true], ['8','♦',true], ['5','♣'], ['2','♠']],
    accent: 'text-white/40 border-white/[0.07] bg-white/[0.02]',
    glow: 'bg-white/5',
  },
];

export const PokerRulesSection = () => (
  <section id="rules" className="relative bg-[#080808] px-6 py-28 lg:px-8">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(124,58,237,0.07),transparent_50%)]" />

    <div className="relative z-10 mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="mb-16"
      >
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400">
          Hand rankings
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-lg text-4xl font-medium tracking-tight text-white sm:text-5xl">
            Know the hand. Win the pot.
          </h2>
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-white/40 lg:text-right">
            Texas Hold'em uses a 52-card deck. Best five-card hand from your two hole cards and five community cards wins.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {handRankings.map((hand, i) => (
          <motion.div
            key={hand.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: Math.floor(i / 2) * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#0d0d0d] p-6 transition-all duration-300 hover:border-white/15 hover:-translate-y-0.5"
          >
            <div className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${hand.glow}`} />

            <div className="relative z-10">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${hand.accent}`}>
                    #{hand.rank}
                  </span>
                  <h4 className="mt-3 text-xl font-medium text-white">{hand.name}</h4>
                  <p className="mt-1 text-sm text-white/40">{hand.desc}</p>
                </div>
              </div>

              <div className="flex gap-1.5">
                {hand.cards.map(([rank, suit, red], j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 + j * 0.05 }}
                  >
                    <MiniCard rank={rank} suit={suit} red={red} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
