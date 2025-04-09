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
        projectId: '67f27fe312a6cb3e921dbe57',
        appId: '67f27ff412a6cb3e921dbe5c',
        secretKey:
          'vGemdydFtKSa2abATbtXaoMFvmTqd0u5rPv3iFReJQr1VamFTWNgUS+4FaSt+Vtt',
        isProductionMode: !isDevMode(),
      });
    }), provideAnimationsAsync(),
  ],
};
