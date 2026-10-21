import { describe, expect, it } from 'vitest';
import { RoomService } from './roomService.js';

describe('RoomService', () => {
  it('creates a room and adds host', () => {
    const service = new RoomService();
    const room = service.createRoom({ id: 'host-1', socketId: 'socket-host', name: 'Host', avatar: '🙂' });

    expect(room.code).toHaveLength(6);
    expect(room.players).toHaveLength(1);
    expect(room.players[0].name).toBe('Host');
  });

  it('joins room and rejects overcapacity', () => {
    const service = new RoomService();
    const room = service.createRoom({ id: 'host-1', socketId: 'socket-host', name: 'Host', avatar: '🙂' });

    room.settings.maxPlayers = 2;
    service.joinRoom(room.code, { id: 'p2', socketId: 's2', name: 'Guest', avatar: '🎨' });
    service.joinRoom(room.code, { id: 'p3', socketId: 's3', name: 'Guest2', avatar: '🦊' });

    expect(service.getRoom(room.code)?.players).toHaveLength(2);
  });

  it('accepts a correct guess and awards points', () => {
    const service = new RoomService();
    const room = service.createRoom({ id: 'host-1', socketId: 'host-socket', name: 'Host', avatar: '🙂' });
    service.joinRoom(room.code, { id: 'p2', socketId: 'p2-socket', name: 'Guess', avatar: '🧠' });
    room.currentArtistId = 'host-1';
    room.state = 'DRAWING';
    room.secretWord = 'cat';

    const result = service.submitGuess(room.code, 'p2', 'cat');

    expect(result.correct).toBe(true);
    expect(result.points).toBeGreaterThan(0);
    expect(service.getRoom(room.code)?.players.find((player) => player.id === 'p2')?.score).toBe(100);
  });
});
