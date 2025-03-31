import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from '../core/transloco/transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { provideAuth } from '../core/auth/auth.provider';
import {
  provideNgIconsConfig,
  withContentSecurityPolicy,
} from '@ng-icons/core';
import { provideCore } from '../core/providers/core.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'es'],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideNgIconsConfig({}, withContentSecurityPolicy()),
    provideAuth(),
    provideCore(),
  ],
};
