export const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-black/75 backdrop-blur-md border-b border-white/[0.07]">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between">
      <div className="flex items-center gap-10">
        <a href="#" className="text-xl font-bold tracking-tighter text-white">
          Pokerr.
        </a>
        <div className="hidden md:flex items-center gap-7">
          <a href="#games" className="text-sm text-white/45 hover:text-white transition-colors">Games</a>
          <a href="#features" className="text-sm text-white/45 hover:text-white transition-colors">Features</a>
          <a href="#rules" className="text-sm text-white/45 hover:text-white transition-colors">Rules</a>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <a href="#" className="text-sm text-white/55 hover:text-white transition-colors hidden sm:block">
          Log in
        </a>
        <button className="px-5 py-2 border border-white/20 text-white text-sm font-medium hover:bg-white hover:text-black transition-colors">
          Sign up
        </button>
      </div>
    </div>
  </nav>
);
