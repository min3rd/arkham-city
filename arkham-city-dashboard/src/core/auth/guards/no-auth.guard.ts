import { inject } from '@angular/core';
import { Router, type CanActivateChildFn } from '@angular/router';
import { AuthService } from '../auth.service';
import { of, switchMap } from 'rxjs';

export const noAuthGuard: CanActivateChildFn = () => {
  const router: Router = inject(Router);
  return inject(AuthService)
    .check()
    .pipe(
      switchMap((authenticated) => {
        if (authenticated) {
          return of(router.parseUrl(''));
        }
        return of(true);
      }),
    );
};
