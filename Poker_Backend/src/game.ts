import type { Game } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

export type Suit = 's' | 'h' | 'd' | 'c';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  rank: Rank;
  suit: Suit;
}

export interface PlayerData {
  id: string;
  name: string;
  chips: number;
  bet: number;
  folded: boolean;
  cards: Card[];
  hasActed: boolean;
}

export interface LogEntry {
  id: string;
  actor: string;
  message: string;
  tone: 'dealer' | 'fold' | 'bet' | 'player' | 'hero';
}

export interface WinnerSummary {
  names: string[];
  handName: string;
  amountWon: number;
}

export interface PokerGameState {
  pot: number;
  currentHighBet: number;
  communityCards: Card[];
  deck: Card[];
  players: { [id: string]: PlayerData };
  logs: LogEntry[];
  winnerInfo?: WinnerSummary | null;
  stage: 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';
  dealer: number;
}

const RANK_VALUES: Record<Rank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14,
};

function generateDeck(): Card[] {
  const suits: Suit[] = ['s', 'h', 'd', 'c'];
  const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const cardI = deck[i];
    const cardJ = deck[j];
    if (cardI && cardJ) {
      deck[i] = cardJ;
      deck[j] = cardI;
    }
  }
  return deck;
}

function addLog(G: PokerGameState, actor: string, message: string, tone: LogEntry['tone']) {
  G.logs.push({
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    actor,
    message,
    tone,
  });
}

function evaluate5Cards(cards: Card[]): { score: number; name: string } {
  const values = cards.map((c) => RANK_VALUES[c.rank]).sort((a, b) => b - a);
  const suits = cards.map((c) => c.suit);
  const isFlush = suits.every((s) => s === suits[0]);

  let isStraight = false;
  let straightHigh = 0;
  const uniqueVals = Array.from(new Set(values));

  if (uniqueVals.length === 5) {
    if (uniqueVals[0]! - uniqueVals[4]! === 4) {
      isStraight = true;
      straightHigh = uniqueVals[0]!;
    } else if (
      uniqueVals[0] === 14 &&
      uniqueVals[1] === 5 &&
      uniqueVals[2] === 4 &&
      uniqueVals[3] === 3 &&
      uniqueVals[4] === 2
    ) {
      isStraight = true;
      straightHigh = 5;
    }
  }

  const counts: Record<number, number> = {};
  values.forEach((v) => {
    counts[v] = (counts[v] || 0) + 1;
  });

  const countGroups = Object.entries(counts)
    .map(([val, count]) => ({ val: Number(val), count }))
    .sort((a, b) => b.count - a.count || b.val - a.val);

  const pattern = countGroups.map((g) => g.count).join('');
  const tieBreaker = countGroups.reduce((acc, g) => acc * 15 + g.val, 0);

  if (isFlush && isStraight) {
    return {
      score: 8 * 1e8 + straightHigh,
      name: straightHigh === 14 ? 'Royal Flush' : 'Straight Flush',
    };
  }
  if (pattern === '41') return { score: 7 * 1e8 + tieBreaker, name: 'Four of a Kind' };
  if (pattern === '32') return { score: 6 * 1e8 + tieBreaker, name: 'Full House' };
  if (isFlush) return { score: 5 * 1e8 + tieBreaker, name: 'Flush' };
  if (isStraight) return { score: 4 * 1e8 + straightHigh, name: 'Straight' };
  if (pattern === '311') return { score: 3 * 1e8 + tieBreaker, name: 'Three of a Kind' };
  if (pattern === '221') return { score: 2 * 1e8 + tieBreaker, name: 'Two Pair' };
  if (pattern === '2111') return { score: 1 * 1e8 + tieBreaker, name: 'One Pair' };
  return { score: tieBreaker, name: 'High Card' };
}

function evaluate7Cards(sevenCards: Card[]): { score: number; name: string } {
  let best = { score: -1, name: '' };
  for (let i = 0; i < sevenCards.length; i++) {
    for (let j = i + 1; j < sevenCards.length; j++) {
      const fiveCards = sevenCards.filter((_, idx) => idx !== i && idx !== j);
      const res = evaluate5Cards(fiveCards);
      if (res.score > best.score) {
        best = res;
      }
    }
  }
  return best;
}

function resolveShowdown(G: PokerGameState) {
  const activePlayers = Object.values(G.players).filter((p) => !p.folded);
  if (activePlayers.length === 0) return;

  if (activePlayers.length === 1 && activePlayers[0]) {
    const winner = activePlayers[0];
    const amountWon = G.pot;
    winner.chips += amountWon;
    G.winnerInfo = {
      names: [winner.name],
      handName: 'Opponents Folded',
      amountWon,
    };
    addLog(G, 'Dealer', `${winner.name} wins pot of $${amountWon} (everyone folded)`, 'dealer');
    G.pot = 0;
    G.stage = 'showdown';
    return;
  }

  const playerHands = activePlayers.map((player) => {
    const totalCards = [...player.cards, ...G.communityCards];
    const hand = evaluate7Cards(totalCards);
    addLog(G, player.name, `shows ${hand.name}`, player.id === '0' ? 'hero' : 'player');
    return { player, hand };
  });

  const maxScore = Math.max(...playerHands.map((ph) => ph.hand.score));
  const winners = playerHands.filter((ph) => ph.hand.score === maxScore);
  const splitPot = Math.floor(G.pot / winners.length);

  winners.forEach((w) => {
    w.player.chips += splitPot;
  });

  const winningHandName = winners[0]?.hand.name || 'Best Hand';
  G.winnerInfo = {
    names: winners.map((w) => w.player.name),
    handName: winningHandName,
    amountWon: splitPot,
  };

  addLog(
    G,
    'Dealer',
    `${winners.map((w) => w.player.name).join(' & ')} won $${splitPot} with ${winningHandName}`,
    'dealer'
  );

  G.pot = 0;
  G.stage = 'showdown';
}

function autoRunoutBoard(G: PokerGameState) {
  while (G.communityCards.length < 5) {
    const card = G.deck.pop();
    if (card) G.communityCards.push(card);
  }
  resolveShowdown(G);
}

// Find next seated player who is NOT folded and HAS chips left
function getNextActiveSeat(G: PokerGameState, startSeat: number): string | null {
  const totalPlayers = Object.keys(G.players).length;
  let seat = (startSeat + 1) % totalPlayers;
  for (let i = 0; i < totalPlayers; i++) {
    const p = G.players[seat.toString()];
    if (p && !p.folded && p.chips > 0) {
      return seat.toString();
    }
    seat = (seat + 1) % totalPlayers;
  }
  return null;
}

function checkAndAdvanceRound(G: PokerGameState): boolean {
  const nonFolded = Object.values(G.players).filter((p) => !p.folded);

  if (nonFolded.length <= 1) {
    resolveShowdown(G);
    return true;
  }

  const playersWithChips = nonFolded.filter((p) => p.chips > 0);

  // If 0 or 1 player has chips remaining, auto-run to showdown
  if (playersWithChips.length <= 1 && nonFolded.every((p) => p.bet === G.currentHighBet || p.chips === 0)) {
    autoRunoutBoard(G);
    return true;
  }

  const allBetsMatched = nonFolded.every((p) => p.bet === G.currentHighBet || p.chips === 0);
  const allActed = nonFolded.every((p) => p.hasActed || p.chips === 0);

  if (!allBetsMatched || !allActed) {
    return false;
  }

  // Advance Street: reset bets and reset hasActed so everyone can act on the new street
  Object.values(G.players).forEach((p) => {
    p.bet = 0;
    p.hasActed = false;
  });
  G.currentHighBet = 0;

  if (G.stage === 'preflop') {
    const c1 = G.deck.pop();
    const c2 = G.deck.pop();
    const c3 = G.deck.pop();
    if (c1 && c2 && c3) G.communityCards.push(c1, c2, c3);
    G.stage = 'flop';
    addLog(G, 'Dealer', 'Dealing the Flop (3 cards)', 'dealer');
    return true;
  } else if (G.stage === 'flop') {
    const c = G.deck.pop();
    if (c) G.communityCards.push(c);
    G.stage = 'turn';
    addLog(G, 'Dealer', 'Dealing the Turn', 'dealer');
    return true;
  } else if (G.stage === 'turn') {
    const c = G.deck.pop();
    if (c) G.communityCards.push(c);
    G.stage = 'river';
    addLog(G, 'Dealer', 'Dealing the River', 'dealer');
    return true;
  } else if (G.stage === 'river') {
    resolveShowdown(G);
    return true;
  }

  return false;
}

function routeTurn(G: PokerGameState, currentSeat: string, events: any) {
  const nonFolded = Object.values(G.players).filter((p) => !p.folded);
  if (nonFolded.length <= 1) {
    resolveShowdown(G);
    return;
  }

  const advanced = checkAndAdvanceRound(G);
  if (G.stage === 'showdown') {
    return;
  }

  const startFrom = advanced ? G.dealer : Number(currentSeat);
  const nextSeat = getNextActiveSeat(G, startFrom);

  if (nextSeat !== null && events?.endTurn) {
    events.endTurn({ next: nextSeat });
  } else {
    autoRunoutBoard(G);
  }
}

export const TexasHoldemEngine: Game<PokerGameState> = {
  name: 'texas-holdem',
  minPlayers: 3,
  maxPlayers: 8,

  setup: ({ ctx }) => {
    const deck = generateDeck();
    const players: { [id: string]: PlayerData } = {};
    const totalPlayers = ctx.numPlayers || 6;

    for (let i = 0; i < totalPlayers; i++) {
      const id = i.toString();
      const card1 = deck.pop()!;
      const card2 = deck.pop()!;
      players[id] = {
        id,
        name: `Player ${i + 1}`,
        chips: 1500,
        bet: 0,
        folded: false,
        cards: [card1, card2],
        hasActed: false,
      };
    }

    const dealer = 0;
    const sbSeat = (dealer + 1) % totalPlayers;
    const bbSeat = (dealer + 2) % totalPlayers;

    const sbPlayer = players[sbSeat.toString()];
    if (sbPlayer) {
      sbPlayer.chips -= 10;
      sbPlayer.bet = 10;
    }

    const bbPlayer = players[bbSeat.toString()];
    if (bbPlayer) {
      bbPlayer.chips -= 20;
      bbPlayer.bet = 20;
    }

    return {
      pot: 30,
      currentHighBet: 20,
      communityCards: [],
      deck,
      players,
      winnerInfo: null,
      dealer,
      logs: [
        { id: '1', actor: 'Dealer', message: `Table initialized (${totalPlayers} seats)`, tone: 'dealer' },
        { id: '2', actor: `Player ${sbSeat + 1}`, message: 'posted Small Blind $10', tone: 'bet' },
        { id: '3', actor: `Player ${bbSeat + 1}`, message: 'posted Big Blind $20', tone: 'bet' },
      ],
      stage: 'preflop',
    };
  },

  moves: {
    check: ({ G, ctx, playerID, events }) => {
      if (ctx.currentPlayer !== playerID) return INVALID_MOVE;
      const player = G.players[playerID];
      if (!player || player.folded || player.bet < G.currentHighBet) return INVALID_MOVE;

      player.hasActed = true;
      addLog(G, player.name, 'checked', 'player');
      routeTurn(G, playerID, events);
      return;
    },

    call: ({ G, ctx, playerID, events }) => {
      if (ctx.currentPlayer !== playerID) return INVALID_MOVE;
      const player = G.players[playerID];
      if (!player || player.folded) return INVALID_MOVE;

      const callAmount = G.currentHighBet - player.bet;
      if (callAmount <= 0) return INVALID_MOVE;

      const actualAmount = Math.min(player.chips, callAmount);
      player.chips -= actualAmount;
      player.bet += actualAmount;
      G.pot += actualAmount;
      player.hasActed = true;

      addLog(G, player.name, `called $${actualAmount}`, playerID === '0' ? 'hero' : 'player');
      routeTurn(G, playerID, events);
      return;
    },

    raise: ({ G, ctx, playerID, events }, raiseTotal: number) => {
      if (ctx.currentPlayer !== playerID) return INVALID_MOVE;
      const player = G.players[playerID];
      if (!player || player.folded) return INVALID_MOVE;

      const maxAllowed = player.chips + player.bet;
      const isAllIn = raiseTotal >= maxAllowed;
      const minAllowed = Math.max(G.currentHighBet + 10, 10);

      if (!isAllIn && raiseTotal < minAllowed) {
        return INVALID_MOVE;
      }

      const actualRaiseTotal = Math.min(raiseTotal, maxAllowed);
      const additionalChips = actualRaiseTotal - player.bet;

      player.chips -= additionalChips;
      player.bet = actualRaiseTotal;
      G.currentHighBet = Math.max(G.currentHighBet, actualRaiseTotal);
      G.pot += additionalChips;

      // Re-open action for all other active players who haven't folded
      Object.values(G.players).forEach((p) => {
        if (!p.folded && p.id !== playerID) {
          p.hasActed = false;
        }
      });
      player.hasActed = true;

      addLog(
        G,
        player.name,
        isAllIn ? `went ALL-IN for $${actualRaiseTotal}` : `raised to $${actualRaiseTotal}`,
        'bet'
      );

      routeTurn(G, playerID, events);
      return;
    },

    fold: ({ G, ctx, playerID, events }) => {
      if (ctx.currentPlayer !== playerID) return INVALID_MOVE;
      const player = G.players[playerID];
      if (!player) return INVALID_MOVE;

      player.folded = true;
      player.hasActed = true;
      addLog(G, player.name, 'folded', 'fold');

      const remaining = Object.values(G.players).filter((p) => !p.folded);
      if (remaining.length === 1 && remaining[0]) {
        const winner = remaining[0];
        const amountWon = G.pot;
        winner.chips += amountWon;
        G.winnerInfo = {
          names: [winner.name],
          handName: 'Opponents Folded',
          amountWon,
        };
        addLog(G, 'Dealer', `${winner.name} takes the pot of $${amountWon}`, 'dealer');
        G.pot = 0;
        G.stage = 'showdown';
        return;
      }

      routeTurn(G, playerID, events);
      return;
    },

    nextHand: ({ G, events }) => {
      if (G.stage !== 'showdown') return INVALID_MOVE;

      const totalPlayers = Object.keys(G.players).length;
      G.dealer = (G.dealer + 1) % totalPlayers;

      const deck = generateDeck();
      G.communityCards = [];
      G.deck = deck;
      G.stage = 'preflop';
      G.pot = 0;
      G.winnerInfo = null;

      // Reset all players with chips back to active (folded: false)
      Object.values(G.players).forEach((p) => {
        p.folded = p.chips <= 0;
        p.bet = 0;
        p.hasActed = false;
        if (!p.folded) {
          p.cards = [deck.pop()!, deck.pop()!];
        } else {
          p.cards = [];
        }
      });

      const sbSeat = (G.dealer + 1) % totalPlayers;
      const bbSeat = (G.dealer + 2) % totalPlayers;

      const sbPlayer = G.players[sbSeat.toString()];
      const bbPlayer = G.players[bbSeat.toString()];

      if (sbPlayer && !sbPlayer.folded) {
        const sbAmt = Math.min(sbPlayer.chips, 10);
        sbPlayer.chips -= sbAmt;
        sbPlayer.bet = sbAmt;
        G.pot += sbAmt;
      }

      if (bbPlayer && !bbPlayer.folded) {
        const bbAmt = Math.min(bbPlayer.chips, 20);
        bbPlayer.chips -= bbAmt;
        bbPlayer.bet = bbAmt;
        G.pot += bbAmt;
      }

      G.currentHighBet = 20;

      // First to act pre-flop is Under The Gun (first active player after Big Blind)
      const utgSeat = getNextActiveSeat(G, bbSeat) || ((G.dealer + 3) % totalPlayers).toString();

      addLog(
        G,
        'Dealer',
        `Hand started with Dealer on Seat ${G.dealer + 1}. Action on Seat ${Number(utgSeat) + 1}`,
        'dealer'
      );

      if (events?.endTurn) {
        events.endTurn({ next: utgSeat });
      }

      return;
    },
  },
};