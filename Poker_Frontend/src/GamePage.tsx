import React, { useState } from 'react';
import { DynamicPokerClient } from './pokerClient';

export type GamePageProps = {
  user: { id?: string; email: string };
  onSignOut: () => void;
};

function generateTableCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function GamePage({ user, onSignOut }: GamePageProps) {
  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [playerCount, setPlayerCount] = useState<number>(6);
  const [selectedSeat, setSelectedSeat] = useState<string>('0');
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [tab, setTab] = useState<'create' | 'join'>('create');

  if (activeTable) {
    return (
      <DynamicPokerClient
        matchID={activeTable}
        playerID={selectedSeat}
        numPlayers={playerCount}
        user={user}
        onSignOut={onSignOut}
        onLeaveTable={() => setActiveTable(null)}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center p-6 selection:bg-white/20 font-sans">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-white/[0.02] blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#0d0d11]/90 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
              <span className="text-neutral-400">♠</span> Table Lobby
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition cursor-pointer"
          >
            Sign out
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-xl bg-black/40 p-1 border border-white/[0.06] mb-4">
          <button
            type="button"
            onClick={() => setTab('create')}
            className={`py-2 text-xs font-medium rounded-lg transition cursor-pointer ${
              tab === 'create'
                ? 'bg-white/[0.08] text-white border border-white/10'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Host Table
          </button>
          <button
            type="button"
            onClick={() => setTab('join')}
            className={`py-2 text-xs font-medium rounded-lg transition cursor-pointer ${
              tab === 'join'
                ? 'bg-white/[0.08] text-white border border-white/10'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Join Table
          </button>
        </div>

        {tab === 'create' ? (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                  Capacity
                </span>
                <span className="font-mono text-xs text-neutral-300">{playerCount} Players</span>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {[3, 4, 5, 6, 7, 8].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      setPlayerCount(count);
                      if (Number(selectedSeat) >= count) setSelectedSeat('0');
                    }}
                    className={`py-1.5 text-xs rounded-lg border transition cursor-pointer ${
                      playerCount === count
                        ? 'bg-white text-black border-white font-semibold'
                        : 'bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:bg-white/[0.05]'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
                Starting Seat
              </span>
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: playerCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedSeat(i.toString())}
                    className={`py-1.5 text-xs rounded-lg border transition cursor-pointer ${
                      selectedSeat === i.toString()
                        ? 'bg-white text-black border-white font-semibold'
                        : 'bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:bg-white/[0.05]'
                    }`}
                  >
                    S{i + 1}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTable(generateTableCode())}
              className="w-full py-2.5 bg-white text-black hover:bg-neutral-200 font-semibold text-xs rounded-xl shadow-lg transition active:scale-[0.99] cursor-pointer tracking-wider uppercase mt-2"
            >
              Start Game
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
                Room Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="6-DIGIT CODE"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                className="w-full bg-black/60 border border-white/[0.1] rounded-xl py-2 px-3 text-center font-mono text-base font-semibold tracking-[0.25em] text-white uppercase focus:border-white/30 focus:outline-none"
              />
            </div>

            <div>
              <span className="block text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
                Starting Seat
              </span>
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedSeat(i.toString())}
                    className={`py-1.5 text-xs rounded-lg border transition cursor-pointer ${
                      selectedSeat === i.toString()
                        ? 'bg-white text-black border-white font-semibold'
                        : 'bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:bg-white/[0.05]'
                    }`}
                  >
                    S{i + 1}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={joinCodeInput.trim().length < 4}
              onClick={() => setActiveTable(joinCodeInput.trim())}
              className="w-full py-2.5 bg-white text-black hover:bg-neutral-200 disabled:opacity-30 font-semibold text-xs rounded-xl shadow-lg transition active:scale-[0.99] cursor-pointer tracking-wider uppercase mt-2"
            >
              Join Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GamePage;