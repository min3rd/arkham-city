import {
  ApplicationConfig,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { globalConfig } from 'arkham-city-websdk/dist/manager';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAppInitializer(() => {
      globalConfig({
        url: 'http://localhost:3000',
        version: 'v1',
        projectId: '67f71b0ba9ae99e7aaf82e71',
        appId: '67f71b1fa9ae99e7aaf82e75',
        secretKey:
          'Z315Nvw0CrpQoDpyQvvRvhTQSuo460SfzXU8wmP7LDWitXYEiTZjT4LDH4Wkz8Va',
        isProductionMode: true,
      });
    }),
    provideAnimationsAsync(),
  ],
};
