import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './Hero';
import { FeaturesSection } from './sections/FeaturesSection';
import { PlayModesSection } from './sections/PlayModesSection';
import { PokerRulesSection } from './sections/PokerRulesSection';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-white/20 text-white font-sans relative">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <PlayModesSection />
      <PokerRulesSection />
      <Footer />
    </div>
  );
}

export default App;
import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import ActionLog, { type LogEntry } from './components/ActionLog'
import PokerTable, { type Player } from './components/Table'
import { Login } from './components/Login'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

type User = {
  id: string
  email: string
}

const players: Player[] = [
  {
    id: 'you',
    name: 'You',
    chips: 5400,
    isHero: true,
    isTurn: true,
    bet: 400,
    cards: [
      { rank: 'A', suit: 'd' },
      { rank: 'A', suit: 'h' },
    ],
  },
  { id: 'fishy', name: 'Fishy', chips: 3100, folded: true },
  { id: 'shark', name: 'Shark', chips: 8750, bet: 400 },
  { id: 'progamer', name: 'ProGamer', chips: 10200, bet: 400 },
  { id: 'nit', name: 'Nit', chips: 2400, folded: true },
  { id: 'donk', name: 'Donk', chips: 6600, bet: 400 },
]

const logEntries: LogEntry[] = [
  {
    id: '1',
    actor: 'Dealer',
    message: 'Hand #40291 started',
    tone: 'dealer',
  },
  {
    id: '2',
    actor: 'Nit',
    message: 'folded',
    tone: 'fold',
  },
  {
    id: '3',
    actor: 'Donk',
    message: 'raised to $400',
    tone: 'bet',
  },
  {
    id: '4',
    actor: 'Shark',
    message: 'called $400',
    tone: 'player',
  },
  {
    id: '5',
    actor: 'ProGamer',
    message: 'called $400',
    tone: 'player',
  },
  {
    id: '6',
    actor: 'Fishy',
    message: 'folded',
    tone: 'fold',
  },
  {
    id: '7',
    actor: 'You',
    message: 'called $400',
    tone: 'hero',
  },
  {
    id: '8',
    actor: 'Dealer',
    message: 'flop dealt [Ah Kc Qd]',
    tone: 'dealer',
  },
]

function PokerGame({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#0b1330] font-sans text-slate-200">
      <Navbar userEmail={user.email} onSignOut={onSignOut} />

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4 sm:p-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,_#141c3a_0%,_#0c1226_45%,_#05070f_100%)]" />

          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
            }}
          />

          <div className="absolute inset-0 shadow-[inset_0_0_200px_90px_rgba(0,0,0,0.85)]" />
        </div>

        <PokerTable
          players={players}
          pot={2450}
          communityCards={[
            { rank: 'A', suit: 'h' },
            { rank: 'K', suit: 'c' },
            { rank: 'Q', suit: 'd' },
            { rank: 'J', suit: 'c' },
          ]}
        />
      </div>

      <ActionLog entries={logEntries} />
    </div>
  )
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const authError = new URLSearchParams(window.location.search).get('authError')

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, {
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) {
          return null
        }

        return response.json()
      })
      .then((data: { user: User } | null) => {
        setUser(data?.user ?? null)
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  function signInWithGoogle() {
    window.location.assign(`${API_URL}/auth/google`)
  }

  async function signOut() {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })

    setUser(null)
  }

  if (loading) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p>Checking your session…</p>
        </section>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="auth-page">
        <Login
          error={authError}
          onGoogleSignIn={signInWithGoogle}
        />
      </main>
    )
  }

  return <PokerGame user={user} onSignOut={signOut} />
}

export default App
