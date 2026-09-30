import { PlayerIdentity } from "./player.model";

export interface GameRoomDto {
    id: string,
    gameId: number,
    maxPlayers: number,
    activePlayers: number,
    players: PlayerIdentity[];    
}