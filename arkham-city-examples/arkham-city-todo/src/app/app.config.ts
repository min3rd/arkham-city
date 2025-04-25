import { ApplicationConfig, isDevMode, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
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
        projectId: '68075da4ccae85f2016da2b5',
        appId: '680af9adf25bf1f7cd9d936f',
        secretKey:
          'KFf/uq8Dl1VwNVABxgJyjM2I14OpItM9jIPQe8XnESZ+IAAZJQa/LFYUP2rTHO5z',
        isProductionMode: !isDevMode(),
      });
    }),
    provideAnimationsAsync(),
  ],
};
