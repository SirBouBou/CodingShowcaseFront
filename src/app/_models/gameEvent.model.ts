import { GameDto } from "./gameDto.model";

export type GameEventType = 'GAME_STARTED' | 'MOVE_PLAYED' | 'GAME_FINISHED';

export interface GameEvent {
    type: GameEventType,
    game: GameDto
}