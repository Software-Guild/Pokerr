import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card } from '@yojda/react-playing-cards'

export type CardRank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A'
export type CardSuit = 'h' | 'd' | 'c' | 's'
export type CardCode = { rank: CardRank; suit: CardSuit }

export type Player = {
  id: string
  name: string
  chips: number
  avatar?: string
  isHero?: boolean
  folded?: boolean
  isTurn?: boolean
  isDealer?: boolean
  bet?: number
  cards?: [CardCode, CardCode]
}

type PokerTableProps = {
  players: Player[]
  communityCards?: CardCode[]
  pot?: number
  width?: number
  height?: number
}

function PlayingCard({ rank, suit, width = 64 }: CardCode & { width?: number }) {
  return (
    <div className="rounded-md overflow-hidden shadow-[0_8px_16px_rgba(0,0,0,0.6)] ring-1 ring-black/40 transition-transform duration-200 hover:-translate-y-1">
      <Card rank={rank} suit={suit} variant="primary" width={width} />
    </div>
  )
}

function CardBack({ width = 64 }: { width?: number }) {
  const height = Math.round(width * 1.45)
  return (
    <div
      style={{ width, height }}
      className="relative rounded-md overflow-hidden shadow-[0_8px_18px_rgba(0,0,0,0.6)] border border-[#d4af37]/60 bg-[#500b1a]"
    >
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: 'repeating-linear-gradient(45deg, #701026 0px, #701026 6px, #420716 6px, #420716 12px)',
        }}
      />
      <div className="absolute inset-[3px] rounded-[3px] border border-[#d4af37]/40" />
      <div
        className="absolute inset-0 flex items-center justify-center text-[#d4af37]/80 font-bold"
        style={{ fontSize: Math.round(width * 0.35) }}
      >
        ♠
      </div>
    </div>
  )
}

function ChipIcon({ size = 15 }: { size?: number }) {
  return (
    <span
      className="relative inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: 'repeating-conic-gradient(#ef4444 0deg 30deg, #f8fafc 30deg 60deg)',
        boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.6)',
      }}
    />
  )
}

function ResponsiveStage({
  baseWidth,
  baseHeight,
  children,
}: {
  baseWidth: number
  baseHeight: number
  children: React.ReactNode
}) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const outer = outerRef.current
    const parent = outer?.parentElement
    if (!parent) return

    const update = () => {
      const availW = parent.clientWidth
      const availH = parent.clientHeight
      if (!availW || !availH) return
      const next = Math.min(availW / baseWidth, availH / baseHeight, 1.1)
      setScale(Math.max(next, 0.32))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(parent)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [baseWidth, baseHeight])

  return (
    <div
      ref={outerRef}
      className="flex items-center justify-center"
      style={{ width: baseWidth * scale, height: baseHeight * scale }}
    >
      <div
        style={{
          width: baseWidth,
          height: baseHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center',
        }}
      >
        {children}
      </div>
    </div>
  )
}

type Seat = { x: number; y: number; nx: number; ny: number }

function seatPositions(count: number, a: number, b: number): Seat[] {
  if (count <= 0) return []
  const SAMPLES = 2000
  const START = Math.PI / 2
  const angles: number[] = [START]
  const cumulative: number[] = [0]

  let prevX = a * Math.cos(START)
  let prevY = b * Math.sin(START)
  let travelled = 0

  for (let i = 1; i <= SAMPLES; i++) {
    const t = START + (2 * Math.PI * i) / SAMPLES
    const x = a * Math.cos(t)
    const y = b * Math.sin(t)
    travelled += Math.hypot(x - prevX, y - prevY)
    angles.push(t)
    cumulative.push(travelled)
    prevX = x
    prevY = y
  }

  const perimeter = travelled

  return Array.from({ length: count }, (_, i) => {
    const target = (perimeter * i) / count
    let lo = 0
    let hi = cumulative.length - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cumulative[mid] < target) lo = mid + 1
      else hi = mid
    }

    const t = angles[lo]
    const x = a * Math.cos(t)
    const y = b * Math.sin(t)
    const gx = x / (a * a)
    const gy = y / (b * b)
    const len = Math.hypot(gx, gy) || 1

    return { x, y, nx: gx / len, ny: gy / len }
  })
}

function PlayerSeat({ player, seat }: { player: Player; seat: Seat }) {
  const OUTWARD = 26
  const BET_INSET = 66
  const dimmed = player.folded

  return (
    <>
      {!!player.bet && !player.folded && (
        <div
          className="absolute z-40 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-auto"
          style={{
            left: `calc(50% + ${seat.x - seat.nx * BET_INSET}px)`,
            top: `calc(50% + ${seat.y - seat.ny * BET_INSET}px)`,
          }}
        >
          <div className="flex items-center gap-1 rounded-full border border-amber-500/50 bg-black/90 px-2 py-0.5 shadow-xl backdrop-blur-md">
            <ChipIcon size={13} />
            <span className="whitespace-nowrap text-[10px] font-extrabold tracking-wide text-amber-300">
              ${player.bet.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {player.isDealer && !player.folded && (
        <div
          className="absolute z-40 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          style={{
            left: `calc(50% + ${seat.x - seat.nx * (BET_INSET - 22)}px)`,
            top: `calc(50% + ${seat.y - seat.ny * (BET_INSET - 22)}px)`,
          }}
        >
          <div className="flex h-4 w-4 items-center justify-center rounded-full border border-amber-300 bg-gradient-to-b from-white to-slate-200 text-[9px] font-black text-black shadow-lg">
            D
          </div>
        </div>
      )}

      <div
        className="absolute z-30 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
        style={{
          left: `calc(50% + ${seat.x + seat.nx * OUTWARD}px)`,
          top: `calc(50% + ${seat.y + seat.ny * OUTWARD}px)`,
        }}
      >
        {/* HOLE CARDS */}
        {player.isHero && player.cards ? (
          <div className="-mb-5 z-10 flex items-center justify-center relative">
            <div className="-mr-4 transform -rotate-6 transition-transform hover:-translate-y-2">
              <PlayingCard {...player.cards[0]} width={54} />
            </div>
            <div className="transform rotate-6 transition-transform hover:-translate-y-2">
              <PlayingCard {...player.cards[1]} width={54} />
            </div>
          </div>
        ) : (
          !player.folded && (
            <div className="-mb-4 z-10 flex items-center justify-center relative opacity-90">
              <div className="-mr-3 transform -rotate-6">
                <CardBack width={26} />
              </div>
              <div className="transform rotate-6">
                <CardBack width={26} />
              </div>
            </div>
          )
        )}

        {/* AVATAR RING */}
        <div
          className={[
            'relative z-20 overflow-hidden rounded-full border-2 bg-slate-800 shadow-[0_6px_16px_rgba(0,0,0,0.8)] transition-all duration-300',
            player.isHero ? 'h-16 w-16' : 'h-14 w-14',
            player.isTurn
              ? 'border-emerald-400 ring-4 ring-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.6)]'
              : 'border-slate-600',
            dimmed ? 'opacity-40 grayscale' : '',
          ].join(' ')}
        >
          <img
            src={player.avatar ?? `https://api.dicebear.com/7.x/bottts/svg?seed=${player.id}`}
            alt={player.name}
            className="h-full w-full object-cover block"
          />
        </div>

        <div
          className={[
            'relative z-30 -mt-2 rounded-lg border px-2.5 py-0.5 text-center shadow-2xl backdrop-blur-md transition-all duration-300',
            player.isHero ? 'min-w-[100px]' : 'min-w-[88px]',
            dimmed
              ? 'border-slate-800 bg-[#0c1017]/80'
              : player.isHero
                ? 'border-emerald-500/50 bg-[#121926]/95'
                : 'border-slate-700/80 bg-[#121926]/95',
          ].join(' ')}
        >
          <p
            className={[
              'truncate text-[11px] font-bold tracking-wide',
              dimmed ? 'text-slate-500' : player.isHero ? 'text-emerald-400' : 'text-slate-200',
            ].join(' ')}
          >
            {player.name}
          </p>
          <p
            className={[
              'mt-0.5 flex items-center justify-center gap-1 text-[10px] font-extrabold',
              dimmed ? 'text-amber-700/70' : 'text-amber-400',
            ].join(' ')}
          >
            {player.folded ? (
              'FOLDED'
            ) : (
              <>
                <ChipIcon size={9} />
                ${player.chips.toLocaleString()}
              </>
            )}
          </p>
        </div>
      </div>
    </>
  )
}

export default function PokerTable({
  players,
  communityCards = [],
  pot = 0,
  width = 880,
  height = 370,
}: PokerTableProps) {
  const seated = useMemo(() => {
    const heroIndex = players.findIndex((p) => p.isHero)
    if (heroIndex <= 0) return players
    return [...players.slice(heroIndex), ...players.slice(0, heroIndex)]
  }, [players])

  const seats = useMemo(
    () => seatPositions(seated.length, width / 2, height / 2),
    [seated.length, width, height],
  )

  return (
    <ResponsiveStage baseWidth={width + 80} baseHeight={height + 80}>
    <div className="relative flex items-center justify-center select-none" style={{ width: width + 80, height: height + 80 }}>
      {/* AMBIENT GLOW */}
      <div className="absolute inset-4 z-0 rounded-[180px] bg-black/80 blur-3xl" />

      {/* LEATHER RAIL */}
      <div
        className="relative z-10 flex items-center justify-center rounded-[180px] p-3 shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
        style={{
          width,
          height,
          background: 'linear-gradient(135deg, #2b1a11 0%, #170e09 50%, #2b1a11 100%)',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1), 0 20px 50px rgba(0,0,0,0.95)',
        }}
      >
        {/* GOLD RIMS */}
        <div className="relative flex h-full w-full items-center justify-center rounded-[168px] border border-amber-500/30 p-1 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          
          {/* GREEN FELT SURFACE */}
          <div
            className="relative flex h-full w-full flex-col items-center justify-center rounded-[164px] overflow-hidden z-10"
            style={{
              background: 'radial-gradient(ellipse at center, #128a52 0%, #0a5c36 50%, #053b22 85%, #032616 100%)',
              boxShadow: 'inset 0 0 100px rgba(0,0,0,0.85)',
            }}
          >
            <span className="pointer-events-none absolute select-none font-serif text-4xl italic font-black tracking-[0.35em] text-white/[0.04]">
              ACES HIGH
            </span>

            <div className="pointer-events-none absolute inset-8 rounded-[140px] border border-emerald-300/10" />

            <div className="flex flex-col items-center justify-center gap-2 z-20">
              {pot > 0 && (
                <div className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-black/80 px-5 py-1 shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-md">
                  <ChipIcon size={16} />
                  <span className="bg-gradient-to-b from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-xs font-black tracking-wider text-transparent">
                    POT: ${pot.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-black/25 p-2.5 shadow-inner backdrop-blur-sm">
                {Array.from({ length: 5 }, (_, i) =>
                  communityCards[i] ? (
                    <PlayingCard key={i} {...communityCards[i]} width={62} />
                  ) : (
                    <CardBack key={i} width={62} />
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none z-30">
            {seated.map((player, i) => (
              <PlayerSeat key={player.id} player={player} seat={seats[i]} />
            ))}
          </div>

        </div>
      </div>
    </div>
    </ResponsiveStage>
  )
}