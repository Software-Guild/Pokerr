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
import { useState } from 'react'
import ProfileSidebar, { type Profile } from './ProfileSidebar'

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={12} cy={12} r={3} />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.3l.06.06A1.65 1.65 0 0 0 8.92 4.7c.14-.06.28-.1.42-.14A1.65 1.65 0 0 0 10.35 3V3a2 2 0 0 1 4 0v.09c0 .66.39 1.25 1 1.51.14.04.28.08.42.14a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.06.14.1.28.14.42.36.11.75.17 1.15.17H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

const NAV_LINKS = ['Lobby', 'Tournaments', 'Leaderboard']

const baseProfile: Profile = {
  name: 'You',
  handle: '@you',
  chips: 5400,
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=you',
}

export default function Navbar({ userEmail, onSignOut }: { userEmail: string; onSignOut: () => void }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const profile = { ...baseProfile, handle: userEmail }

  return (
    <header className="relative z-50 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#0a1128]/90 px-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-8">
        <span className="bg-gradient-to-b from-emerald-300 to-emerald-500 bg-clip-text font-serif text-xl font-black tracking-wide text-transparent">
          Pokerr
        </span>
        <nav className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-100"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4 sm:gap-5">
        <button className="rounded-md bg-gradient-to-b from-emerald-400 to-emerald-600 px-3.5 py-1.5 text-xs font-bold text-emerald-950 shadow-[0_2px_10px_rgba(16,185,129,0.4)] transition-transform hover:scale-105">
          Deposit
        </button>
        <button className="text-slate-400 transition-colors hover:text-emerald-400" aria-label="Notifications">
          <BellIcon />
        </button>
        <button className="text-slate-400 transition-colors hover:text-emerald-400" aria-label="Settings">
          <GearIcon />
        </button>
        <button
          onClick={() => setProfileOpen(true)}
          aria-label="Open profile"
          className="h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500/50 bg-slate-800 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-transform hover:scale-105"
        >
          <img src={profile.avatar} alt="Profile" className="h-full w-full object-cover" />
        </button>
      </div>

      <ProfileSidebar
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={profile}
        onLogout={onSignOut}
      />
    </header>
  )
}
