import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DBGameResponse } from '../_models/dbGamesResponse.model';
import { Page } from '../_models/page.model';

const AUTH_API = `${environment.apiUrl}/website/dbgame/`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class DbGameService {
  private readonly http = inject(HttpClient);
  constructor() {}

  getPage(page:number): Observable<Page<DBGameResponse>> {
    return this.http.get<Page<DBGameResponse>>(AUTH_API + `getAll?page=${page}`);
  }
}