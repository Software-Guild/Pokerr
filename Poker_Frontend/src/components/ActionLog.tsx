export type LogTone = 'dealer' | 'hero' | 'player' | 'fold' | 'bet'

export type LogEntry = {
  id: string
  actor: string
  message: string
  tone: LogTone
}

const TONE_STYLES: Record<LogTone, string> = {
  dealer: 'text-amber-400',
  hero: 'text-emerald-400',
  player: 'text-sky-400',
  fold: 'text-rose-400',
  bet: 'text-amber-300',
}

const TONE_BAR: Record<LogTone, string> = {
  dealer: 'bg-amber-400',
  hero: 'bg-emerald-400',
  player: 'bg-sky-400',
  fold: 'bg-rose-400',
  bet: 'bg-amber-300',
}

function ScrollIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function LogRow({ entry }: { entry: LogEntry }) {
  return (
    <div className="group flex items-stretch gap-2.5 rounded-md px-1.5 py-1.5 transition-colors hover:bg-white/[0.04]">
      <span className={`w-[3px] shrink-0 rounded-full ${TONE_BAR[entry.tone]}`} />
      <p className="min-w-0 truncate text-xs leading-relaxed">
        <span className={`font-bold ${TONE_STYLES[entry.tone]}`}>{entry.actor}</span>
        <span className="text-slate-400"> {entry.message}</span>
      </p>
    </div>
  )
}

export default function ActionLog({ entries }: { entries: LogEntry[] }) {
  return (
    <footer className="relative z-50 flex h-44 shrink-0 flex-col border-t border-white/10 bg-gradient-to-b from-[#0d1430] to-[#080b1c] px-4 pb-3 pt-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-6">
      <div className="mb-2 flex shrink-0 items-center gap-1.5 text-slate-500">
        <ScrollIcon />
        <span className="text-[11px] font-bold uppercase tracking-widest">Hand Log</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col-reverse gap-0.5 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
        {[...entries].reverse().map((entry) => (
          <LogRow key={entry.id} entry={entry} />
        ))}
      </div>
    </footer>
  )
}
