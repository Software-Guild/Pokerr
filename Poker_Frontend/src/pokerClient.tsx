import React, { useState, useEffect, useMemo } from 'react';
import { Client } from 'boardgame.io/react';
import type { BoardProps } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import type { PokerGameState } from '../../Poker_Backend/src/game';
import { TexasHoldemEngine } from '../../Poker_Backend/src/game';

import ActionLog from './components/ActionLog';
import PokerTable, { type Player } from './components/Table';

interface CustomBoardProps extends BoardProps<PokerGameState> {
  user?: { email: string };
  onSignOut?: () => void;
  onLeaveTable?: () => void;
  tableCode?: string;
}

function LivePokerBoard(props: CustomBoardProps) {
  const { G, ctx, moves, playerID, user, onSignOut, onLeaveTable, tableCode } = props;
  const currentSeat = playerID || '0';
  const myData = G.players[currentSeat];
  const isShowdown = G.stage === 'showdown';

  const [showLog, setShowLog] = useState(true);
  const minAllowedRaise = Math.max((G.currentHighBet || 20) + 10, 10);
  const maxAllowedRaise = myData ? myData.chips + myData.bet : minAllowedRaise;
  const [raiseAmount, setRaiseAmount] = useState<number>(minAllowedRaise);

  useEffect(() => {
    setRaiseAmount(Math.min(minAllowedRaise, maxAllowedRaise));
  }, [G.currentHighBet]);

  const adjustRaise = (val: number) => {
    setRaiseAmount(Math.min(maxAllowedRaise, Math.max(minAllowedRaise, val)));
  };

  const formattedPlayers: Player[] = Object.values(G.players).map((p) => {
    const isHero = p.id === currentSeat;
    const shouldShowCards = (isHero || (isShowdown && !p.folded)) && p.cards && p.cards.length >= 2;
    const cards = shouldShowCards ? ([p.cards[0], p.cards[1]] as any) : undefined;
    const isDealer = Number(p.id) === G.dealer;

    return {
      id: p.id,
      name: `${isHero ? (user?.email?.split('@')[0] || 'You') : p.name}${isDealer ? ' (D)' : ''}`,
      chips: p.chips,
      isHero,
      isTurn: ctx.currentPlayer === p.id && !isShowdown,
      bet: p.bet,
      folded: p.folded,
      cards,
    };
  });

  const isMyTurn = ctx.currentPlayer === currentSeat && myData && !myData.folded && !isShowdown;
  const canCheck = myData ? myData.bet >= G.currentHighBet : false;
  const toCall = myData ? G.currentHighBet - myData.bet : 0;

  // Active turn name calculation
  const activePlayerObj = G.players[ctx.currentPlayer];
  const activePlayerName =
    ctx.currentPlayer === currentSeat
      ? 'You'
      : activePlayerObj?.name || `Seat ${Number(ctx.currentPlayer) + 1}`;

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#060608] font-sans text-neutral-200">
      {/* Left Feed */}
      {showLog && (
        <aside className="relative z-30 flex h-full w-72 min-w-[18rem] flex-col border-r border-white/[0.06] bg-[#09090c]/95 backdrop-blur-xl overflow-x-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Live Feed
            </span>
            <button
              onClick={() => setShowLog(false)}
              className="text-xs text-neutral-500 hover:text-neutral-300 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 min-w-0">
            <ActionLog entries={G.logs} />
          </div>
        </aside>
      )}

      {/* Main Canvas */}
      <main className="relative flex flex-1 flex-col overflow-hidden">
        <header className="relative z-20 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0a0e]/80 px-5 py-2.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {!showLog && (
              <button
                onClick={() => setShowLog(true)}
                className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs text-neutral-300 hover:bg-white/[0.08] cursor-pointer"
              >
                Log Feed
              </button>
            )}
            <span className="font-mono text-xs font-semibold text-neutral-200 bg-white/[0.05] px-2.5 py-0.5 rounded border border-white/10">
              {tableCode || 'MAIN'}
            </span>
            <span className="text-neutral-700">•</span>
            <span className="text-xs text-neutral-400">Seat {Number(currentSeat) + 1}</span>
            <span className="text-neutral-700">•</span>
            <span className="text-xs text-neutral-400">Dealer: Seat {G.dealer + 1}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500">{user?.email}</span>
            {onLeaveTable && (
              <button
                onClick={onLeaveTable}
                className="text-xs font-medium text-neutral-400 hover:text-white transition px-2.5 py-1 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] cursor-pointer"
              >
                Leave
              </button>
            )}
          </div>
        </header>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,_#111713_0%,_#070a08_55%,_#050507_100%)]" />

          <PokerTable
            players={formattedPlayers}
            pot={G.pot}
            communityCards={G.communityCards as any}
          />

          {/* Showdown Modal */}
          {isShowdown && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#101013] p-6 text-center shadow-2xl max-w-xs w-[90%]">
                <div className="text-2xl">♠</div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-white">
                    {G.winnerInfo?.names.join(' & ') || 'Winner'}
                  </h3>
                  <p className="mt-1 font-mono text-xl font-bold text-white">
                    +${G.winnerInfo?.amountWon?.toLocaleString() || 0}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {G.winnerInfo?.handName || 'Hand Concluded'}
                  </p>
                </div>
                <button
                  onClick={() => (moves as any).nextHand()}
                  className="w-full mt-2 py-2.5 bg-white text-black hover:bg-neutral-200 font-semibold rounded-xl transition active:scale-[0.98] cursor-pointer text-xs uppercase tracking-wider"
                >
                  Deal Next Hand
                </button>
              </div>
            </div>
          )}

          {/* Waiting Indicator (when not your turn) */}
          {!isMyTurn && !isShowdown && (
            <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0d0d11]/90 px-4 py-3 shadow-xl backdrop-blur-xl animate-in fade-in duration-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-neutral-400">
                Waiting for <span className="font-semibold text-white">{activePlayerName}</span> to act...
              </span>
            </div>
          )}

          {/* Action HUD (when it is your turn) */}
          {isMyTurn && (
            <div className="absolute bottom-6 right-6 z-30 w-72 rounded-2xl border border-white/10 bg-[#0d0d11]/95 p-3.5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="mb-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-neutral-500">
                    Target
                  </span>
                  <span className="font-mono text-xs font-bold text-white">
                    ${raiseAmount.toLocaleString()}
                  </span>
                </div>

                <input
                  type="range"
                  min={minAllowedRaise}
                  max={maxAllowedRaise}
                  step={10}
                  value={raiseAmount}
                  onChange={(e) => setRaiseAmount(Number(e.target.value))}
                  className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-white"
                />

                <div className="grid grid-cols-4 gap-1 pt-0.5">
                  <button
                    type="button"
                    onClick={() => adjustRaise(raiseAmount + 10)}
                    className="rounded border border-white/[0.06] bg-white/[0.03] py-0.5 text-[10px] font-medium text-neutral-300 hover:bg-white/[0.08]"
                  >
                    +10
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustRaise(raiseAmount + 50)}
                    className="rounded border border-white/[0.06] bg-white/[0.03] py-0.5 text-[10px] font-medium text-neutral-300 hover:bg-white/[0.08]"
                  >
                    +50
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustRaise(G.pot)}
                    className="rounded border border-white/[0.06] bg-white/[0.03] py-0.5 text-[10px] font-medium text-neutral-300 hover:bg-white/[0.08]"
                  >
                    Pot
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustRaise(maxAllowedRaise)}
                    className="rounded border border-white/[0.06] bg-white/[0.03] py-0.5 text-[10px] font-medium text-neutral-300 hover:bg-white/[0.08]"
                  >
                    All-In
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => moves.fold()}
                  className="rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] py-2 text-xs font-medium text-neutral-300 transition cursor-pointer"
                >
                  Fold
                </button>

                {canCheck ? (
                  <button
                    type="button"
                    onClick={() => moves.check()}
                    className="rounded-lg border border-white/10 bg-white/[0.08] hover:bg-white/[0.14] py-2 text-xs font-medium text-white transition cursor-pointer"
                  >
                    Check
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => moves.call()}
                    className="rounded-lg border border-white/10 bg-white/[0.08] hover:bg-white/[0.14] py-2 text-xs font-medium text-white transition cursor-pointer"
                  >
                    Call ${toCall}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => moves.raise(raiseAmount)}
                  className="rounded-lg bg-white text-black hover:bg-neutral-200 py-2 text-xs font-semibold transition cursor-pointer"
                >
                  Raise
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export function DynamicPokerClient({
  numPlayers,
  matchID,
  playerID,
  user,
  onSignOut,
  onLeaveTable,
}: {
  numPlayers: number;
  matchID: string;
  playerID: string;
  user?: { email: string };
  onSignOut?: () => void;
  onLeaveTable?: () => void;
}) {
  const ClientComponent = useMemo(() => {
    return Client({
      game: TexasHoldemEngine,
      board: LivePokerBoard as any,
      multiplayer: SocketIO({ server: 'http://localhost:8000' }),
      numPlayers: numPlayers || 6,
      debug: false,
    });
  }, [numPlayers]);

  const Comp = ClientComponent as any;
  return (
    <Comp
      matchID={matchID}
      playerID={playerID}
      user={user}
      onSignOut={onSignOut}
      onLeaveTable={onLeaveTable}
      tableCode={matchID}
    />
  );
}