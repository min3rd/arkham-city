import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  EnvironmentProviders,
  inject,
  provideAppInitializer,
  provideEnvironmentInitializer,
  Provider,
} from '@angular/core';
import { loadingInterceptor } from '../../../projects/arkhamcity/src/lib/services/loading/loading.interceptor';
import { LoadingService } from '../../../projects/arkhamcity/src/lib/services/loading/loading.service';
import { ConfigService } from '../../../projects/arkhamcity/src/lib/services/config.service';
import { AuthService } from '../auth/auth.service';
import { forkJoin } from 'rxjs';

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
