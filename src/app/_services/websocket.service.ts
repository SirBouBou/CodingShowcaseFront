import { Injectable } from '@angular/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import { RoomEvent } from '../_models/roomEvent.model';
import { Subject } from 'rxjs';
import { GameEvent } from '../_models/gameEvent.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private roomEventSubject = new Subject<RoomEvent>();
  private gameEventSubject = new Subject<GameEvent>();

  readonly roomEvent$ = this.roomEventSubject.asObservable();
  readonly gameEvent$ = this.gameEventSubject.asObservable();

  private activeGameRoomId: string | null = null;

  private roomSubscription?: StompSubscription;
  private gameSubscription?: StompSubscription;

  private client = new Client({
    brokerURL: 'ws://localhost:8080/ws',//TODO: Change for prod

    reconnectDelay: 5000,

    debug: message => {
      console.log('[STOMP]', message);
    }
  });

  connect(): void {
    if (this.client.active) {
      return;
    }

    this.client.onConnect = () => {
      console.log('WebSocket connected');

      this.subscribeToRooms();
      this.subscribeToActiveGameRoom();
    };

    this.client.onStompError = frame => {
      console.error('STOMP error:', frame);
    };

    this.client.activate();
  }

  disconnect(): void {
    this.roomSubscription?.unsubscribe();
    this.gameSubscription?.unsubscribe();

    this.roomSubscription = undefined;
    this.gameSubscription = undefined;

    this.client.deactivate();
  }

  setActiveGameRoom(roomId: string | null): void {
    if (this.activeGameRoomId === roomId) {
      return;
    }
    this.activeGameRoomId = roomId;
    this.subscribeToActiveGameRoom();
  }

  private subscribeToRooms(): void {
    this.roomSubscription?.unsubscribe();
    this.roomSubscription = undefined;

    if (!this.client.connected) {
      return;
    }

    this.roomSubscription = this.client.subscribe(
      '/topic/rooms',
      message => {
        const event: RoomEvent = JSON.parse(message.body);
        this.roomEventSubject.next(event);
      }
    );
  }

  private subscribeToActiveGameRoom(): void {
    this.gameSubscription?.unsubscribe();
    this.gameSubscription = undefined;

    if (!this.activeGameRoomId || !this.client.connected) {
      return;
    }

    this.gameSubscription = this.client.subscribe(
      `/topic/rooms/${this.activeGameRoomId}`,
      message => {
        const event: GameEvent = JSON.parse(message.body);
        this.gameEventSubject.next(event);
      }
    );
  }
}