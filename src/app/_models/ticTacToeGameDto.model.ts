import { GameDto } from "./gameDto.model";
import { PlayerIdentity } from "./player.model";

export type TicTacToeCell = 'EMPTY' | 'X' | 'O'

export type GameStatus = 'WAITING' | 'PLAYING' | 'DRAW' | 'FINISHED'

export interface TicTacToeGameDto extends GameDto {
    playerX: PlayerIdentity | null,
    playerO: PlayerIdentity | null,
    board: TicTacToeCell[],
    currentPlayer: PlayerIdentity | null,
    winner: PlayerIdentity | null,
}