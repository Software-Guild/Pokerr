type LoginProps = {
  error?: string | null
  onGoogleSignIn: () => void
}

export function Login({ error, onGoogleSignIn }: LoginProps) {
  return (
    <section className="auth-card">
      <h1>Poker</h1>
      <p>Sign in to join a table.</p>
      {error && <p className="error">Google sign-in failed. Please try again.</p>}
      <button type="button" onClick={onGoogleSignIn}>
        Continue with Google
      </button>
    </section>
  )
}
