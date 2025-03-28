import type { HttpInterceptorFn } from '@angular/common/http';
import { LoadingService } from './loading.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService: LoadingService = inject(LoadingService);
  loadingService.setLoadingStatus(req.url, true);
  return next(req).pipe(
    finalize(() => {
      loadingService.setLoadingStatus(req.url, false);
    })
  );
};
