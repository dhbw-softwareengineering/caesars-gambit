export interface UserDTO {
  id: number;
  username: string;
  email: string;
}

export interface PlayerDTO {
  userId: number;
  username: string;
  isHost: boolean;
}

export interface ChatMessageDTO {
  username: string;
  message: string;
}

export interface TerritoryStatusDTO {
  territory: string;
  owner: string;
  troops: number;
}

export interface GameStateDTO {
  roomId: number;
  players: PlayerDTO[];
  territories: TerritoryStatusDTO[];
  currentPlayerIndex: number;
  phase: 'DISTRIBUTION' | 'ATTACK' | 'MOVE' | 'PENDING';
}

export interface AuthResponseDTO {
  accessToken: string;
}

export interface RoomResponseDTO {
  roomId: number;
  hostId: number;
  playersCount: number;
}
