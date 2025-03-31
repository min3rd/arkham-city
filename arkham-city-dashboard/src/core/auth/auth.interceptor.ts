import {
  HttpErrorResponse,
  HttpStatusCode,
  type HttpInterceptorFn,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthUtils } from './auth.utils';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  let newReq = req.clone();
  if (
    authService.accessToken &&
    !AuthUtils.isExpired(authService.accessToken)
  ) {
    newReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${authService.accessToken}`
      ),
    });
  }
  return next(newReq).pipe(
    catchError((err) => {
      if (
        err instanceof HttpErrorResponse &&
        err.status === HttpStatusCode.Unauthorized
      ) {
        authService.logOut();
        location.reload();
      }
      return throwError(err);
    })
  );
};
