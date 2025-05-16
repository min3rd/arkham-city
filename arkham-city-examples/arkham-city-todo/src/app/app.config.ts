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
        projectId: '68196609a274d48747d8b437',
        appId: '6819661ea274d48747d8b43b',
        secretKey:
          '0kzRT5JocEf+nUUpPzrwRzgFs0NIpI93Msp4ICMVmtzq31MOGitE+1aW7MmAyC5T',
        isProductionMode: !isDevMode(),
      });
    }),
    provideAnimationsAsync(),
  ],
};
