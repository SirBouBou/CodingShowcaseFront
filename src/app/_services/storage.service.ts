import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  clean(): void {
    globalThis.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    globalThis.sessionStorage.removeItem(USER_KEY);
    globalThis.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = globalThis.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  public isLoggedIn(): boolean {
    const user = globalThis.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
}