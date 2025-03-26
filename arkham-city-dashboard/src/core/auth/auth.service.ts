import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { LogInData, User } from './auth.type';
import { Response } from '../type/response.type';
import { ConfigService } from '../services/config.service';
import { SecurityService } from '../services/security.service';
import { AuthUtils } from './auth.utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  static readonly KEY_ACCESS_TOKEN = 'KEY_ACCESS_TOKEN';
  static readonly KEY_REFRESH_TOKEN = 'KEY_REFRESH_TOKEN';
  static readonly KEY_USER = 'KEY_USER';
  private httpClient: HttpClient = inject(HttpClient);
  private configService: ConfigService = inject(ConfigService);
  private securityService: SecurityService = inject(SecurityService);
  constructor() {}
  set accessToken(value: string) {
    localStorage.setItem(
      AuthService.KEY_ACCESS_TOKEN,
      this.securityService.encrypt(value)
    );
  }
  get accessToken(): string | null {
    if (!localStorage.getItem(AuthService.KEY_ACCESS_TOKEN)) {
      return null;
    }
    return this.securityService.decrypt(
      localStorage.getItem(AuthService.KEY_ACCESS_TOKEN) as string
    );
  }
  set refreshToken(value: string) {
    localStorage.setItem(
      AuthService.KEY_REFRESH_TOKEN,
      this.securityService.encrypt(value)
    );
  }
  get refreshToken(): string | null {
    if (!localStorage.getItem(AuthService.KEY_REFRESH_TOKEN)) {
      return null;
    }
    return this.securityService.decrypt(
      localStorage.getItem(AuthService.KEY_REFRESH_TOKEN) as string
    );
  }
  set user(value: User) {
    localStorage.setItem(
      AuthService.KEY_USER,
      this.securityService.encrypt(value)
    );
  }
  get user(): User | null {
    if (!localStorage.getItem(AuthService.KEY_USER)) {
      return null;
    }
    return this.securityService.decrypt<User>(
      localStorage.getItem(AuthService.KEY_USER) as string
    );
  }

  load() {
    if (localStorage.getItem(AuthService.KEY_ACCESS_TOKEN)) {
      this.accessToken = this.securityService.decrypt(
        localStorage.getItem(AuthService.KEY_ACCESS_TOKEN) as string
      ) as string;
    }

    if (localStorage.getItem(AuthService.KEY_REFRESH_TOKEN)) {
      this.refreshToken = this.securityService.decrypt(
        localStorage.getItem(AuthService.KEY_REFRESH_TOKEN) as string
      ) as string;
    }

    if (localStorage.getItem(AuthService.KEY_USER)) {
      this.user = this.securityService.decrypt<User>(
        localStorage.getItem(AuthService.KEY_USER) as string
      ) as any;
    }
  }

  logInByEmailAndPassword(data: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) {
    return this.httpClient
      .post<Response<LogInData>>(
        this.configService.endpoint('/auth/log-in-by-email-and-password'),
        data
      )
      .pipe(
        switchMap((response: Response<LogInData>) => {
          if (response.data.accessToken) {
            this.accessToken = response.data.accessToken;
            this.refreshToken = response.data.refreshToken;
            this.user = response.data.metadata;
          }
          return of(response);
        })
      );
  }
  logInByRefreshToken(): Observable<any> {
    return this.httpClient
      .post<any>(this.configService.endpoint('/auth/log-in-by-refresh-token'), {
        refreshToken: this.refreshToken,
      })
      .pipe(
        catchError(() => {
          return of(false);
        }),
        switchMap((response: Response<LogInData>) => {
          if (response.data.accessToken) {
            this.accessToken = response.data.accessToken;
            this.refreshToken = response.data.refreshToken;
            this.user = response.data.metadata;
            return of(true);
          }
          return of(false);
        })
      );
  }
  registerByEmailAndPassword(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    return this.httpClient.post(
      this.configService.endpoint('/auth/register-by-email-and-password'),
      {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      }
    );
  }

  check(): Observable<boolean> {
    if (!this.accessToken) {
      return of(false);
    }

    if (!this.refreshToken) {
      return of(false);
    }

    if (AuthUtils.isExpired(this.refreshToken)) {
      return of(false);
    }

    return this.logInByRefreshToken();
  }
}
