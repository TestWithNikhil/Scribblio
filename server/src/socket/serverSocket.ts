import { randomUUID } from 'crypto';
import type { Server as SocketIOServer, Socket } from 'socket.io';
import { z } from 'zod';
import type { DrawingStroke, SocketGuessPayload, SocketRoomCreatePayload, SocketRoomJoinPayload, SocketWordSelectPayload } from '@scribblio/shared';
import { RoomService } from '../game/roomService.js';

const createRoomSchema = z.object({
  name: z.string().trim().min(1).max(16),
  avatar: z.string().optional().default('🙂'),
});

const joinRoomSchema = z.object({
  code: z.string().trim().min(4).max(8),
  name: z.string().trim().min(1).max(16),
  avatar: z.string().optional().default('🙂'),
});

const wordSchema = z.object({
  word: z.string().trim().min(1).max(40),
});

const guessSchema = z.object({
  text: z.string().trim().min(1).max(80),
});

const strokeSchema = z.object({
  stroke: z.object({
    id: z.string(),
    tool: z.enum(['brush', 'eraser']),
    color: z.string(),
    size: z.number().min(1).max(40),
    points: z.array(z.object({ x: z.number(), y: z.number() })).min(1),
  }),
});

export function registerSocketHandlers(io: SocketIOServer, roomService: RoomService) {
  io.on('connection', (socket: Socket) => {
    socket.on('room:create', (payload: unknown) => {
      const parsed = createRoomSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit('room:error', { message: 'Invalid room settings.' });
        return;
      }

      const { name, avatar } = parsed.data;
      const room = roomService.createRoom({
        id: socket.id,
        socketId: socket.id,
        name,
        avatar,
      });

      socket.join(room.code);
      socket.data.roomCode = room.code;
      socket.data.playerId = socket.id;
      socket.emit('room:created', { roomCode: room.code, room: roomService.getSnapshot(room.code) });
      io.to(room.code).emit('room:state', roomService.getSnapshot(room.code));
    });

    socket.on('room:join', (payload: unknown) => {
      const parsed = joinRoomSchema.safeParse(payload);
      if (!parsed.success) {
        socket.emit('room:error', { message: 'Please enter a valid room code and nickname.' });
        return;
      }

      const { code, name, avatar } = parsed.data;
      const room = roomService.joinRoom(code.toUpperCase(), {
        id: socket.id,
        socketId: socket.id,
        name,
        avatar,
      });

      if (!room) {
        socket.emit('room:error', { message: 'Unable to join that room.' });
        return;
      }

      socket.join(room.code);
      socket.data.roomCode = room.code;
      socket.data.playerId = socket.id;
      io.to(room.code).emit('room:state', roomService.getSnapshot(room.code));
    });

    socket.on('game:start', () => {
      const code = socket.data.roomCode as string | undefined;
      if (!code) return;
      const room = roomService.beginGame(code);
      if (!room) {
        socket.emit('room:error', { message: 'A game requires at least 2 players.' });
        return;
      }

      roomService.getWordOptionsForRoom(code);
      io.to(code).emit('game:word-options', { wordOptions: roomService.getSnapshot(code)?.wordOptions ?? [] });
      io.to(code).emit('room:state', roomService.getSnapshot(code));
    });

    socket.on('word:select', (payload: unknown) => {
      const parsed = wordSchema.safeParse(payload as SocketWordSelectPayload);
      if (!parsed.success) {
        socket.emit('room:error', { message: 'Word selection was invalid.' });
        return;
      }

      const code = socket.data.roomCode as string | undefined;
      if (!code) return;

      const room = roomService.selectWord(code, socket.id, parsed.data.word);
      if (!room) {
        socket.emit('room:error', { message: 'You are not allowed to select the word for this round.' });
        return;
      }

      io.to(code).emit('game:round-started', {
        currentArtistId: room.currentArtistId,
        wordOptions: room.wordOptions,
        drawingTime: room.settings.drawingTime,
        secretWord: room.secretWord,
      });
      io.to(code).emit('room:state', roomService.getSnapshot(code));
    });

    socket.on('drawing:stroke', (payload: unknown) => {
      const parsed = strokeSchema.safeParse(payload as { stroke: DrawingStroke });
      if (!parsed.success) {
        socket.emit('room:error', { message: 'Stroke payload invalid.' });
        return;
      }

      const code = socket.data.roomCode as string | undefined;
      if (!code) return;

      const nextRoom = roomService.addStroke(code, socket.id, parsed.data.stroke);
      if (!nextRoom) {
        socket.emit('room:error', { message: 'Only the current artist may draw.' });
        return;
      }

      socket.to(code).emit('game:drawing-update', { stroke: parsed.data.stroke });
    });

    socket.on('guess:submit', (payload: unknown) => {
      const parsed = guessSchema.safeParse(payload as SocketGuessPayload);
      if (!parsed.success) {
        socket.emit('room:error', { message: 'Your guess is invalid.' });
        return;
      }

      const code = socket.data.roomCode as string | undefined;
      if (!code) return;

      const result = roomService.submitGuess(code, socket.id, parsed.data.text);
      if (!result.room) {
        socket.emit('room:error', { message: 'Guess rejected.' });
        return;
      }

      io.to(code).emit('game:score-update', roomService.getSnapshot(code));
      io.to(code).emit('room:state', roomService.getSnapshot(code));

      if (result.correct) {
        socket.emit('guess:accepted', { correct: true, points: result.points });
      }
    });

    socket.on('disconnect', () => {
      const roomCode = socket.data.roomCode as string | undefined;
      if (!roomCode) return;
      const room = roomService.removePlayer(roomCode, socket.id);
      if (room) {
        io.to(roomCode).emit('room:state', roomService.getSnapshot(roomCode));
      }
    });
  });
}
