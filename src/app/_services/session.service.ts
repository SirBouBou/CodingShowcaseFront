import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { StorageService } from './storage.service';
import { PlayerIdentity } from '../_models/player.model';
import { AuthService } from './auth.service';
import { GuestService } from './guest.service';

const GUEST_NAME_KEY = 'guest-display-name';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private readonly playerSubject =
    new BehaviorSubject<PlayerIdentity | null>(null);

  readonly player$ = this.playerSubject.asObservable();

  constructor(
    private authService: AuthService,
    private guestService: GuestService,
    private storageService: StorageService
  ) {}

  get player(): PlayerIdentity | null {
    return this.playerSubject.value;
  }

  initialize(): Observable<PlayerIdentity | null> {

    return this.authService.getCurrentUser().pipe(

      tap(player => {
        this.setPlayer(player);
      }),

      catchError(() => {

        return this.guestService.getCurrentGuest().pipe(

          tap(player => {
            this.setPlayer(player);
          }),

          catchError(() => {
            this.clearPlayer();
            return of(null);
          })
        );
      })
    );
  }

  setPlayer(player: PlayerIdentity): void {
    this.storageService.savePlayer(player);
    this.playerSubject.next(player);
  }

  clearPlayer(): void {
    this.storageService.removePlayer();
    this.playerSubject.next(null);
  }

  logout(): Observable<void> {

    return this.authService.logout().pipe(
      tap(() => {
        this.clearPlayer();
      })
    );
  }

  saveGuestName(name: string): void {
    globalThis.localStorage.setItem(
        GUEST_NAME_KEY,
        name
    );
  }

  getGuestName(): string | null {
    return globalThis.localStorage.getItem(
        GUEST_NAME_KEY
    );
  }
}