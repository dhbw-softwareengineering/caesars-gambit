export interface UserDto {
  username: string;
}

export type UserDTO = UserDto;

export interface AuthMessageDto {
  message: string;
}

export interface ApiErrorDto {
  error: string;
}

export type AuthResponseDTO = AuthMessageDto;

export interface LobbyPlayerDto {
  username: string;
  host: boolean;
}

export type PlayerDTO = LobbyPlayerDto;

export interface ChatMessageDto {
  username: string;
  message: string;
}

export type ChatMessageDTO = ChatMessageDto;

export interface TerritoryStateDto {
  territory: string;
  owner: string | null;
  troops: number;
}

export type GameStateDto = TerritoryStateDto[];
export type GameStateDTO = GameStateDto;
