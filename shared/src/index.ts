export type GameState =
  | 'WAITING_FOR_PLAYERS'
  | 'COUNTDOWN'
  | 'WORD_SELECTION'
  | 'DRAWING'
  | 'ROUND_RESULTS'
  | 'GAME_RESULTS'
  | 'CLOSED';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export interface PlayerProfile {
  id: string;
  socketId: string;
  name: string;
  avatar: string;
  score: number;
  hasGuessedCorrectly: boolean;
  isHost: boolean;
  connected: boolean;
}

export interface RoomSettings {
  maxPlayers: number;
  rounds: number;
  drawingTime: number;
  difficulty: Difficulty;
}

export interface WordEntry {
  word: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'en';
}

export interface StrokePoint {
  x: number;
  y: number;
}

export interface DrawingStroke {
  id: string;
  tool: 'brush' | 'eraser';
  color: string;
  size: number;
  points: StrokePoint[];
}

export interface GuessEntry {
  id: string;
  playerId: string;
  text: string;
  isCorrect: boolean;
}

export interface RoomSnapshot {
  id: string;
  code: string;
  state: GameState;
  hostId: string;
  players: PlayerProfile[];
  settings: RoomSettings;
  currentRound: number;
  totalRounds: number;
  currentArtistId?: string;
  wordOptions: WordEntry[];
  secretWord?: string;
  drawing: DrawingStroke[];
  messages: GuessEntry[];
  timerEndsAt?: number;
  winner?: string;
  roundWinner?: string;
  correctGuessers: string[];
  hint?: string;
}

export interface SocketRoomCreatePayload {
  name: string;
  avatar: string;
}

export interface SocketRoomJoinPayload {
  code: string;
  name: string;
  avatar: string;
}

export interface SocketWordSelectPayload {
  word: string;
}

export interface SocketGuessPayload {
  text: string;
}

export interface SocketDrawingStrokePayload {
  stroke: DrawingStroke;
}
