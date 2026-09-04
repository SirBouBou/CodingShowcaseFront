import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { PlayerIdentity } from '../_models/player.model';

const AUTH_API = `${environment.apiUrl}/auth/`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  constructor() {}

  login(username: string, password: string): Observable<PlayerIdentity> {
    return this.http.post<PlayerIdentity>(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  register(username: string, email: string, password: string): Observable<PlayerIdentity> {
    return this.http.post<PlayerIdentity>(
      AUTH_API + 'signup',
      {
        username,
        email,
        password,
      },
      httpOptions
    );
  }

  refreshToken(): Observable<void> {
    return this.http.post<void>(
      AUTH_API + 'refresh', 
      {}, 
      httpOptions
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(AUTH_API + 'signout', { }, httpOptions);
  }

  getCurrentUser(): Observable<PlayerIdentity> {
    return this.http.get<PlayerIdentity>(
      AUTH_API + 'me', 
      httpOptions
    );
  }
}