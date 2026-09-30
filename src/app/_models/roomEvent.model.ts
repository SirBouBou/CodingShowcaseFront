import { GameRoomDto } from "./gameRoomDto.model";

export type RoomEventType = 'CREATED' | 'JOINED' | 'LEFT';

export interface RoomEvent {
    type: RoomEventType,
    room: GameRoomDto
}