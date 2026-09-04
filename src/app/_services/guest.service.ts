import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import { Observable, tap } from 'rxjs';
import { PlayerIdentity } from '../_models/player.model';

const AUTH_API = `${environment.apiUrl}/guest/`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root',
})
export class GuestService {
  private readonly http = inject(HttpClient);
  private readonly guestNameKey = 'guestName'
  constructor(private readonly storageService: StorageService) {}

  createSession(name: string): Observable<PlayerIdentity> {
    return this.http.post<PlayerIdentity>(
        AUTH_API + 'session',
        {preferredName: name}
    )
  }

  getCurrentGuest(): Observable<PlayerIdentity> {
    return this.http.get<PlayerIdentity>(
      AUTH_API + 'me',
    );
  }
}