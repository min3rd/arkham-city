import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LogInData, User } from './auth.type';
import { Response } from '../type/response.type';
import { ConfigService } from '../services/config.service';
import { SecurityService } from '../services/security.service';

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
  private _user: BehaviorSubject<User> = new BehaviorSubject<any>(null);
  private _accessToken: BehaviorSubject<string> = new BehaviorSubject<any>(
    null
  );
  private _refreshToken: BehaviorSubject<string> = new BehaviorSubject<any>(
    null
  );
  constructor() {}
  get user$(): Observable<User> {
    return this._user.asObservable();
  }
  get accessToken$(): Observable<string> {
    return this._accessToken.asObservable();
  }
  get refreshToken(): Observable<string> {
    return this._refreshToken.asObservable();
  }
  load() {
    if (localStorage.getItem(AuthService.KEY_ACCESS_TOKEN)) {
      this._accessToken.next(
        this.securityService.decrypt(
          localStorage.getItem(AuthService.KEY_ACCESS_TOKEN) as string
        )
      );
    }

    if (localStorage.getItem(AuthService.KEY_REFRESH_TOKEN)) {
      this._refreshToken.next(
        this.securityService.decrypt(
          localStorage.getItem(AuthService.KEY_REFRESH_TOKEN) as string
        )
      );
    }

    if (localStorage.getItem(AuthService.KEY_USER)) {
      this._user.next(
        this.securityService.decrypt<User>(
          localStorage.getItem(AuthService.KEY_USER) as string
        ) as any
      );
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
        tap((response: Response<LogInData>) => {
          this._user.next(response.data.metadata);
          this._accessToken.next(response.data.accessToken);
          this._refreshToken.next(response.data.refreshToken);

          localStorage.setItem(
            AuthService.KEY_ACCESS_TOKEN,
            this.securityService.encrypt(response.data.accessToken)
          );
          localStorage.setItem(
            AuthService.KEY_REFRESH_TOKEN,
            this.securityService.encrypt(response.data.refreshToken)
          );
          localStorage.setItem(
            AuthService.KEY_USER,
            this.securityService.encrypt(response.data.metadata)
          );
        })
      );
  }
  RegisterByEmailAndPassword(email: string, password: string) {}
}
