type NavbarProps = { onGoogleSignIn: () => void }

export function Navbar({ onGoogleSignIn }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] bg-black/75 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <a href="#" className="text-xl font-bold tracking-tighter text-white">Pokerr.</a>
          <div className="hidden items-center gap-7 md:flex">
            <a href="#games" className="text-sm text-white/45 transition-colors hover:text-white">Games</a>
            <a href="#features" className="text-sm text-white/45 transition-colors hover:text-white">Features</a>
            <a href="#rules" className="text-sm text-white/45 transition-colors hover:text-white">Rules</a>
          </div>
        </div>
        <button
          type="button"
          onClick={onGoogleSignIn}
          className="text-sm text-white/55 transition-colors hover:text-white"
        >
          Log in
        </button>
      </div>
    </nav>
  )
}
