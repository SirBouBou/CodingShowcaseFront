import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GameRoomDto } from '../_models/gameRoomDto.model';
import { GameDto } from '../_models/gameDto.model';

const AUTH_API = `${environment.apiUrl}/game/rooms`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class GameRoomService {
  private readonly http = inject(HttpClient);
  constructor() {}

  getRoomsForGame(gameId: number): Observable<GameRoomDto[]>{
    return this.http.get<GameRoomDto[]>(`${AUTH_API}?gameId=${gameId}`);
  }

  getCurrentRoom(): Observable<GameRoomDto> {
    return this.http.get<GameRoomDto>(
      `${AUTH_API}/current`
    )
  }

  createRoomForGame(gameId: number): Observable<GameRoomDto> {
    return this.http.post<GameRoomDto>(
        `${AUTH_API}?gameId=${gameId}`,
        {}
    )
  }

  joinRoom(roomId: string): Observable<GameRoomDto> {
    return this.http.post<GameRoomDto>(
      `${AUTH_API}/${roomId}/join`,
      {}
    )
  }

  leaveRoom(roomId: string): Observable<void> {
    return this.http.post<void>(
      `${AUTH_API}/${roomId}/leave`,
      {}
    )
  }

  getGame(roomId: string): Observable<GameDto> {
    return this.http.get<GameDto>(
      `${AUTH_API}/${roomId}/game`,
    )
  }

  play(roomId: string, action: string, data: unknown): Observable<GameDto> {
    return this.http.post<GameDto>(
      `${AUTH_API}/${roomId}/play`,
      {
        action,
        data
      }
    )
  }

}