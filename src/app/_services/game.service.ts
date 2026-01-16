import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const AUTH_API = `${environment.apiUrl}/game/`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly http = inject(HttpClient);
  constructor() {}

  getAll(): Observable<any> {
    return this.http.get(AUTH_API + "getAll");
  }
}