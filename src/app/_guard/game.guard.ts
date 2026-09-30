import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IdentityService } from '../_services/identity.service';
import { catchError, map, of } from 'rxjs';

export const gameGuard: CanActivateFn = () => {
  const identityService = inject(IdentityService);
  const router = inject(Router);

  return identityService.ensureIdentity().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/home']);
      return of(false);
    })
  );
};