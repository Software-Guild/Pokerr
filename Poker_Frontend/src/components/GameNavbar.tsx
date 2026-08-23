import { useState } from 'react'
import ProfileSidebar, { type Profile } from './ProfileSidebar'

type GameNavbarProps = { userEmail: string; onSignOut: () => void }

const baseProfile: Profile = {
  name: 'You',
  handle: '@you',
  chips: 5400,
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=you',
}

export function GameNavbar({ userEmail, onSignOut }: GameNavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false)
  const profile = { ...baseProfile, handle: userEmail }

  return (
    <header className="relative z-50 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#0a1128]/90 px-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-8">
        <span className="bg-gradient-to-b from-emerald-300 to-emerald-500 bg-clip-text font-serif text-xl font-black tracking-wide text-transparent">Pokerr</span>
        <nav className="hidden items-center gap-6 sm:flex">
          {['Lobby', 'Tournaments', 'Leaderboard'].map((link) => (
            <a key={link} href="#" className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-100">{link}</a>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4 sm:gap-5">
        <button type="button" className="rounded-md bg-gradient-to-b from-emerald-400 to-emerald-600 px-3.5 py-1.5 text-xs font-bold text-emerald-950">Deposit</button>
        <button type="button" onClick={() => setProfileOpen(true)} aria-label="Open profile" className="h-8 w-8 overflow-hidden rounded-full border-2 border-emerald-500/50 bg-slate-800">
          <img src={profile.avatar} alt="Profile" className="h-full w-full object-cover" />
        </button>
      </div>
      <ProfileSidebar open={profileOpen} onClose={() => setProfileOpen(false)} profile={profile} onLogout={onSignOut} />
    </header>
  )
}
