import { inject } from '@angular/core';
import { Router, type CanActivateChildFn } from '@angular/router';
import { AuthService } from '../auth.service';
import { of, switchMap } from 'rxjs';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const router: Router = inject(Router);
  return inject(AuthService)
    .check()
    .pipe(
      switchMap((authenticated) => {
        console.log(authenticated);
        if (!authenticated) {
          
          const redirectURL = `redirectURL=${state.url}`;
          const urlTree = router.parseUrl(`log-in?${redirectURL}`);
          return of(urlTree);
        }
        return of(true);
      })
    );
};
