import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfig } from '../type/app.type';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  readonly CONFIG_URL = '/assets/json/config.json';
  httpClient: HttpClient = inject(HttpClient);
  appConfig!: AppConfig;
  constructor() {}
  load() {
    return this.httpClient.get<AppConfig>(this.CONFIG_URL).pipe(
      tap((config: AppConfig) => {
        this.appConfig = config;
      })
    );
  }
  endpoint(endpoint: string, version: string = 'v1'): string {
    if (endpoint.startsWith('/')) {
      endpoint = endpoint.substring(1);
    }
    return `${this.appConfig.apiUrl}/${version}/${endpoint}`;
  }
}
