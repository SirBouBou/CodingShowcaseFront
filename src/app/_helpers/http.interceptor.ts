import { inject } from '@angular/core';
import { HttpEvent, HttpRequest, HttpContextToken, HttpErrorResponse, HttpHandlerFn } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

const SKIP_401_REDIRECT = new HttpContextToken<boolean>(() => false);
export { SKIP_401_REDIRECT };

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>>  {
  const authService = inject(AuthService);
  const storageService = inject(StorageService)
  const router = inject(Router);
  let cloned = req.clone({withCredentials:true});

  const isRefreshEndpoint = req.url.includes('/refresh') || req.url.includes('/signout') || req.url.includes('/signin');

  const skipRedirect = req.context.get(SKIP_401_REDIRECT);

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (skipRedirect) {
          return throwError(() => error);
        }

        if (isRefreshEndpoint) {
          storageService.clean();
          // appeler signout backend facultatif : authService.logout().subscribe(...)
          return throwError(() => error);
        }

        return authService.refreshToken().pipe(
          switchMap(() => {
            return next(cloned);
          }),
          catchError((refreshError) => {
            storageService.clean()
            authService.logout().subscribe({ next: ()=>{}, error: ()=>{} });
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      } else if (error.status === 403) {
        if (!skipRedirect) {
          //router.navigate(['/access-denied']);
        }
        return throwError(() => error);;
      }
      return throwError(() => error);
    })
  );
}