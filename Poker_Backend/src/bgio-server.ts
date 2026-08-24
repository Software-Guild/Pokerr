import { Server, Origins } from 'boardgame.io/server';
import { TexasHoldemEngine } from './game';
import { config } from './config';

const bgioServer = Server({
  games: [TexasHoldemEngine],
  origins: [
    config.frontendUrl || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:3000',
    Origins.LOCALHOST,
  ],
});

const BGIO_PORT = 8000;

bgioServer.run(BGIO_PORT, () => {
  console.log(`> Boardgame.io WebSocket Engine listening on port ${BGIO_PORT}`);
});