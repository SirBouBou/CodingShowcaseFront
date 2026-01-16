import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/showcase/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class ShowcaseService {
  private readonly http = inject(HttpClient);
  constructor() {}

  getAll(): Observable<any> {
    return this.http.get(AUTH_API + "getAll");
  }
}