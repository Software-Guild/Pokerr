import { useEffect } from 'react'

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  )
}

type StatProps = { label: string; value: string }

function Stat({ label, value }: StatProps) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-slate-100">{value}</p>
    </div>
  )
}

export type Profile = {
  name: string
  handle: string
  chips: number
  avatar: string
}

export default function ProfileSidebar({
  open,
  onClose,
  profile,
  onLogout,
}: {
  open: boolean
  onClose: () => void
  profile: Profile
  onLogout: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div
        className={[
          'fixed inset-0 z-[60] bg-black/50 backdrop-blur-[1px] transition-opacity duration-300',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={onClose}
      />

      <aside
        className={[
          'fixed right-0 top-0 z-[70] flex h-full w-[300px] flex-col border-l border-white/10 bg-[#0a1128] shadow-[-20px_0_50px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <span className="text-sm font-bold text-slate-100">Profile</span>
          <button
            onClick={onClose}
            aria-label="Close profile"
            className="text-slate-400 transition-colors hover:text-slate-100"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 px-5 pb-6 pt-8">
          <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-emerald-500/60 bg-slate-800 shadow-[0_0_24px_rgba(16,185,129,0.35)]">
            <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-slate-100">{profile.name}</p>
            <p className="text-xs text-slate-500">{profile.handle}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 px-5">
          <Stat label="Chip Balance" value={`$${profile.chips.toLocaleString()}`} />
          <Stat label="Status" value="Active" />
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t border-white/10 px-5 py-5">
          <button className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/[0.06]">
            View Profile
          </button>
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 rounded-md bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-400 transition-colors hover:bg-rose-500/20"
          >
            <LogoutIcon />
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}
