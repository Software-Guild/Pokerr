import { useEffect, useState } from 'react'
import { HeroPage } from './Hero'
import { GamePage } from './GamePage'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

type User = { id: string; email: string }

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, { credentials: 'include' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { user: User } | null) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  function signInWithGoogle() {
    window.location.assign(`${API_URL}/auth/google`)
  }

  async function signOut() {
    await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' })
    setUser(null)
  }

  if (loading) return <main className="auth-page" />
  if (!user) return <HeroPage onGoogleSignIn={signInWithGoogle} />
  return <GamePage user={user} onSignOut={signOut} />
}

export default App
