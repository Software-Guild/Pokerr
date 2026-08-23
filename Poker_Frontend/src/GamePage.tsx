import ActionLog, { type LogEntry } from './components/ActionLog'
import { GameNavbar } from './components/GameNavbar'
import PokerTable, { type Player } from './components/Table'

type GamePageProps = { user: { email: string }; onSignOut: () => void }

const players: Player[] = [
  { id: 'you', name: 'You', chips: 5400, isHero: true, isTurn: true, bet: 400, cards: [{ rank: 'A', suit: 'd' }, { rank: 'A', suit: 'h' }] },
  { id: 'fishy', name: 'Fishy', chips: 3100, folded: true },
  { id: 'shark', name: 'Shark', chips: 8750, bet: 400 },
  { id: 'progamer', name: 'ProGamer', chips: 10200, bet: 400 },
  { id: 'nit', name: 'Nit', chips: 2400, folded: true },
  { id: 'donk', name: 'Donk', chips: 6600, bet: 400 },
]

const logEntries: LogEntry[] = [
  { id: '1', actor: 'Dealer', message: 'Hand #40291 started', tone: 'dealer' },
  { id: '2', actor: 'Nit', message: 'folded', tone: 'fold' },
  { id: '3', actor: 'Donk', message: 'raised to $400', tone: 'bet' },
  { id: '4', actor: 'Shark', message: 'called $400', tone: 'player' },
  { id: '5', actor: 'You', message: 'called $400', tone: 'hero' },
]

export function GamePage({ user, onSignOut }: GamePageProps) {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#0b1330] font-sans text-slate-200">
      <GameNavbar userEmail={user.email} onSignOut={onSignOut} />
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4 sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,_#141c3a_0%,_#0c1226_45%,_#05070f_100%)]" />
        <PokerTable
          players={players}
          pot={2450}
          communityCards={[
            { rank: 'A', suit: 'h' }, { rank: 'K', suit: 'c' }, { rank: 'Q', suit: 'd' }, { rank: 'J', suit: 'c' },
          ]}
        />
      </div>
      <ActionLog entries={logEntries} />
    </div>
  )
}
