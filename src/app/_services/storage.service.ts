import { Injectable } from '@angular/core';
import { PlayerIdentity } from '../_models/player.model';

const PLAYER_KEY = 'player';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  clean(): void {
    globalThis.sessionStorage.clear();
  }

  savePlayer(player: PlayerIdentity): void {
    globalThis.sessionStorage.setItem(
      PLAYER_KEY,
      JSON.stringify(player)
    );
  }

  getPlayer(): PlayerIdentity | null {
    const player = globalThis.sessionStorage.getItem(PLAYER_KEY);
    if (player) {
      return JSON.parse(player);
    }

    return null;
  }

  removePlayer(): void {
    globalThis.sessionStorage.removeItem(PLAYER_KEY);
  }
}