import { randomUUID } from 'crypto';
import type { DrawingStroke, GameState, PlayerProfile, RoomSettings, RoomSnapshot, WordEntry } from '@scribblio/shared';
import { getWordOptions } from './wordBank.js';

export interface PlayerInput {
  id: string;
  socketId: string;
  name: string;
  avatar: string;
  isHost?: boolean;
}

export interface RoomRecord {
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
  messages: Array<{ id: string; playerId: string; text: string; isCorrect: boolean }>;
  timerEndsAt?: number;
  winner?: string;
  roundWinner?: string;
  correctGuessers: string[];
  hint?: string;
  createdAt: number;
  updatedAt: number;
}

const DEFAULT_SETTINGS: RoomSettings = {
  maxPlayers: 6,
  rounds: 3,
  drawingTime: 60,
  difficulty: 'mixed',
};

export class RoomService {
  private rooms = new Map<string, RoomRecord>();

  createRoom(host: PlayerInput): RoomRecord {
    const code = this.generateRoomCode();
    const room: RoomRecord = {
      id: randomUUID(),
      code,
      state: 'WAITING_FOR_PLAYERS',
      hostId: host.id,
      players: [{
        id: host.id,
        socketId: host.socketId,
        name: host.name,
        avatar: host.avatar,
        score: 0,
        hasGuessedCorrectly: false,
        isHost: true,
        connected: true,
      }],
      settings: { ...DEFAULT_SETTINGS },
      currentRound: 0,
      totalRounds: DEFAULT_SETTINGS.rounds,
      wordOptions: [],
      drawing: [],
      messages: [],
      correctGuessers: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.rooms.set(code, room);
    return room;
  }

  joinRoom(code: string, player: PlayerInput): RoomRecord | null {
    const room = this.rooms.get(code);
    if (!room) return null;
    if (room.players.length >= room.settings.maxPlayers) return null;
    const existing = room.players.some((entry) => entry.id === player.id || entry.name.trim().toLowerCase() === player.name.trim().toLowerCase());
    if (existing) return null;

    room.players.push({
      id: player.id,
      socketId: player.socketId,
      name: player.name,
      avatar: player.avatar,
      score: 0,
      hasGuessedCorrectly: false,
      isHost: false,
      connected: true,
    });
    room.updatedAt = Date.now();
    return room;
  }

  getRoom(code: string): RoomRecord | null {
    return this.rooms.get(code) ?? null;
  }

  listRooms(): RoomRecord[] {
    return [...this.rooms.values()];
  }

  removePlayer(code: string, playerId: string): RoomRecord | null {
    const room = this.rooms.get(code);
    if (!room) return null;

    room.players = room.players.filter((player) => player.id !== playerId);
    if (room.hostId === playerId && room.players[0]) {
      room.hostId = room.players[0].id;
      room.players[0].isHost = true;
    }
    room.updatedAt = Date.now();

    if (room.players.length === 0) {
      this.rooms.delete(code);
      return null;
    }

    return room;
  }

  setPlayerConnection(code: string, playerId: string, connected: boolean): RoomRecord | null {
    const room = this.rooms.get(code);
    if (!room) return null;
    const player = room.players.find((entry) => entry.id === playerId);
    if (!player) return null;
    player.connected = connected;
    room.updatedAt = Date.now();
    return room;
  }

  updateSettings(code: string, settings: Partial<RoomSettings>): RoomRecord | null {
    const room = this.rooms.get(code);
    if (!room) return null;
    room.settings = { ...room.settings, ...settings };
    room.updatedAt = Date.now();
    return room;
  }

  beginGame(code: string): RoomRecord | null {
    const room = this.rooms.get(code);
    if (!room) return null;
    if (room.players.length < 2) return null;

    room.state = 'COUNTDOWN';
    room.currentRound = 1;
    room.wordOptions = [];
    room.drawing = [];
    room.messages = [];
    room.correctGuessers = [];
    room.currentArtistId = room.players[0]?.id;
    room.timerEndsAt = Date.now() + 3000;
    room.updatedAt = Date.now();
    return room;
  }

  getWordOptionsForRoom(code: string): WordEntry[] {
    const room = this.rooms.get(code);
    if (!room) return [];
    const options = getWordOptions(room.settings.difficulty, 3);
    room.wordOptions = options;
    room.state = 'WORD_SELECTION';
    room.updatedAt = Date.now();
    return options;
  }

  selectWord(code: string, playerId: string, selectedWord: string): RoomRecord | null {
    const room = this.rooms.get(code);
    if (!room) return null;
    if (room.currentArtistId !== playerId) return null;

    const match = room.wordOptions.find((entry) => entry.word.toLowerCase() === selectedWord.toLowerCase());
    if (!match) return null;

    room.secretWord = match.word;
    room.state = 'DRAWING';
    room.timerEndsAt = Date.now() + room.settings.drawingTime * 1000;
    room.messages = [];
    room.correctGuessers = [];
    room.players.forEach((player) => {
      player.hasGuessedCorrectly = false;
    });
    room.updatedAt = Date.now();
    return room;
  }

  submitGuess(code: string, playerId: string, text: string): { room: RoomRecord | null; correct: boolean; points: number } {
    const room = this.rooms.get(code);
    if (!room) return { room: null, correct: false, points: 0 };
    if (room.state !== 'DRAWING') return { room: null, correct: false, points: 0 };
    if (room.currentArtistId === playerId) return { room: null, correct: false, points: 0 };

    const normalized = text.trim().toLowerCase();
    if (!normalized) return { room: null, correct: false, points: 0 };

    const player = room.players.find((entry) => entry.id === playerId);
    if (!player || player.hasGuessedCorrectly) return { room: null, correct: false, points: 0 };

    const isCorrect = normalized === room.secretWord?.toLowerCase();
    if (!isCorrect) {
      room.messages.push({
        id: randomUUID(),
        playerId,
        text,
        isCorrect: false,
      });
      room.updatedAt = Date.now();
      return { room, correct: false, points: 0 };
    }

    player.hasGuessedCorrectly = true;
    room.correctGuessers.push(playerId);
    room.messages.push({
      id: randomUUID(),
      playerId,
      text,
      isCorrect: true,
    });

    const points = this.calculateGuessPoints(room, playerId);
    player.score += points;
    room.updatedAt = Date.now();

    return { room, correct: true, points };
  }

  calculateGuessPoints(room: RoomRecord, playerId: string): number {
    const idx = room.correctGuessers.findIndex((id) => id === playerId);
    const rankingPoints = [100, 80, 60, 40, 40, 40];
    const bonus = rankingPoints[Math.min(idx, rankingPoints.length - 1)] ?? 40;
    return Math.max(0, bonus);
  }

  addStroke(code: string, playerId: string, stroke: DrawingStroke): RoomRecord | null {
    const room = this.rooms.get(code);
    if (!room || room.currentArtistId !== playerId) return null;
    if (room.state !== 'DRAWING') return null;
    room.drawing.push(stroke);
    room.updatedAt = Date.now();
    return room;
  }

  clearDrawing(code: string, playerId: string): RoomRecord | null {
    const room = this.rooms.get(code);
    if (!room || room.currentArtistId !== playerId) return null;
    room.drawing = [];
    room.updatedAt = Date.now();
    return room;
  }

  getSnapshot(code: string): RoomSnapshot | null {
    const room = this.rooms.get(code);
    if (!room) return null;

    return {
      id: room.id,
      code: room.code,
      state: room.state,
      hostId: room.hostId,
      players: room.players,
      settings: room.settings,
      currentRound: room.currentRound,
      totalRounds: room.totalRounds,
      currentArtistId: room.currentArtistId,
      wordOptions: room.wordOptions,
      secretWord: room.secretWord,
      drawing: room.drawing,
      messages: room.messages,
      timerEndsAt: room.timerEndsAt,
      winner: room.winner,
      roundWinner: room.roundWinner,
      correctGuessers: room.correctGuessers,
      hint: room.hint,
    };
  }

  generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i += 1) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }
}
