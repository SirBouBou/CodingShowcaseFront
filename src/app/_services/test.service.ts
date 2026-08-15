import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { SKIP_401_REDIRECT } from '../_helpers/http.interceptor';


const AUTH_API = `${environment.apiUrl}/test/`;

@Injectable({
  providedIn: 'root',
})
export class TestService {
    private readonly http = inject(HttpClient);
    constructor() {}

    private getRequestOptions() {
      return {
        observe: 'response' as const,
        responseType: 'text' as const,
        withCredentials: true,
        context: new HttpContext().set(SKIP_401_REDIRECT, true) // ✅ NE PAS rediriger sur 401/403
      };
    }

    getEveryone(): Observable<any> {
        return this.http.get(
          AUTH_API + 'all',
          this.getRequestOptions()
        ).pipe(catchError((error: HttpErrorResponse): Observable<never> => {
          console.error("getEveryone error:", error.status);
          return throwError(() => error);;
      }))
    }

    getUserRole(): Observable<any> {
      return this.http.get(
        AUTH_API + 'user',
        this.getRequestOptions()
      ).pipe(catchError((error: HttpErrorResponse): Observable<never> => {
          console.error("getUserRole error:", error.status);
          return throwError(() => error);;
      }))
    }

    getModRole(): Observable<any> {
      return this.http.get(
        AUTH_API + 'mod',
        this.getRequestOptions()
      ).pipe(catchError((error: HttpErrorResponse): Observable<never> => {
          console.error("getModRole error:", error.status);
          return throwError(() => error);;
      }))
    }

    getAdminRole(): Observable<any> {
      return this.http.get(
        AUTH_API + 'admin',
        this.getRequestOptions()
      ).pipe(catchError((error: HttpErrorResponse): Observable<never> => {
          console.error("getAdminRole error:", error.status);
          return throwError(() => error);;
      }))
    }
}