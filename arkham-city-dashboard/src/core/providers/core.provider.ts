import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  EnvironmentProviders,
  inject,
  provideAppInitializer,
  provideEnvironmentInitializer,
  Provider,
} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { forkJoin } from 'rxjs';
import { loadingInterceptor, LoadingService } from 'arkhamcity';
import { ConfigService } from '@core/services/config.service';

export const provideCore = (): (Provider | EnvironmentProviders)[] => {
  return [
    provideAppInitializer(() => {
      const configService = inject(ConfigService);
      return forkJoin([
        configService.load(),
      ]);
    }),
    provideHttpClient(withInterceptors([loadingInterceptor])),
    provideEnvironmentInitializer(() => {
      inject(AuthService).load();
      inject(LoadingService);
    }),
  ];
};
