import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  EnvironmentProviders,
  inject,
  provideAppInitializer,
  provideEnvironmentInitializer,
  Provider,
} from '@angular/core';
import { loadingInterceptor } from '../services/loading/loading.interceptor';
import { LoadingService } from '../services/loading/loading.service';
import { ConfigService } from '../services/config.service';
import { AuthService } from '../auth/auth.service';

export const provideCore = (): Array<Provider | EnvironmentProviders> => {
  return [
    provideAppInitializer(() => {
      inject(ConfigService).load().subscribe();
      inject(AuthService).load();
    }),
    provideHttpClient(withInterceptors([loadingInterceptor])),
    provideEnvironmentInitializer(() => inject(LoadingService)),
  ];
};
