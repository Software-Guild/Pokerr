import { useEffect, useState } from 'react'
import './App.css'
import { Login } from './components/Login'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

type User = { id: string; email: string }

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const authError = new URLSearchParams(window.location.search).get('authError')

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, { credentials: 'include' })
      .then(async (response) => (response.ok ? response.json() : null))
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

  return (
    <main className="auth-page">
      {loading ? (
        <section className="auth-card"><p>Checking your session…</p></section>
      ) : user ? (
        <section className="auth-card">
          <h1>Poker</h1>
          <>
            <p>Signed in as <strong>{user.email}</strong></p>
            <button type="button" onClick={signOut}>Sign out</button>
          </>
        </section>
      ) : (
        <Login error={authError} onGoogleSignIn={signInWithGoogle} />
      )}
    </main>
  )
}

export default App
