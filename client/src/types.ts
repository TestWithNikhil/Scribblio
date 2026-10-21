export type RoomState = 'waiting' | 'in-progress' | 'finished';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  score: number;
}

export interface RoomInfo {
  code: string;
  players: Player[];
  state: RoomState;
  hostId: string;
}
