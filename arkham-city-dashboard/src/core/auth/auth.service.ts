import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LogInData, User } from './auth.type';
import { Response } from '../type/response.type';
import { ConfigService } from '../services/config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient: HttpClient = inject(HttpClient);
  private configService: ConfigService = inject(ConfigService);
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
        })
      );
  }
  RegisterByEmailAndPassword(email: string, password: string) {}
}
