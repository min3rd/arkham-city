import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, take } from 'rxjs';
import { AppResDto, NewAppReqDto, UpdateAppReqDto } from './app.type';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../core/services/config.service';
import { ApiResponse } from '../../../../core/type/response.type';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private _apps: BehaviorSubject<AppResDto[] | null> = new BehaviorSubject<
    AppResDto[] | null
  >(null);
  protected _app: BehaviorSubject<AppResDto | null> =
    new BehaviorSubject<AppResDto | null>(null);
  private httpClient: HttpClient = inject(HttpClient);
  private configService: ConfigService = inject(ConfigService);
  get apps$(): Observable<AppResDto[] | null> {
    return this._apps.asObservable();
  }
  get app$(): Observable<AppResDto | null> {
    return this._app.asObservable();
  }
  create(projectId: string, dto: NewAppReqDto) {
    return this._apps.pipe(
      take(1),
      switchMap((apps) =>
        this.httpClient
          .post<ApiResponse<AppResDto>>(
            this.configService.endpoint(`/projects/${projectId}/apps`),
            dto,
          )
          .pipe(
            switchMap((response: ApiResponse<AppResDto>) => {
              if (!apps || !(apps instanceof Array)) {
                apps = [];
              }
              apps.push(response.data);
              this._app.next(response.data);
              this._apps.next(apps);
              return of(response);
            }),
          ),
      ),
    );
  }

  all(projectId: string) {
    return this.httpClient
      .get<ApiResponse<AppResDto[]>>(
        this.configService.endpoint(`/projects/${projectId}/apps`),
      )
      .pipe(
        switchMap((response: ApiResponse<AppResDto[]>) => {
          this._apps.next(response.data);
          return of(response);
        }),
      );
  }
  get(projectId: string, appId: string) {
    return this._apps.pipe(
      take(1),
      switchMap((apps) =>
        this.httpClient
          .get<ApiResponse<AppResDto>>(
            this.configService.endpoint(`/projects/${projectId}/apps/${appId}`),
          )
          .pipe(
            switchMap((response: ApiResponse<AppResDto>) => {
              if (!apps || !(apps instanceof Array)) {
                apps = [];
              }
              const index = apps.findIndex((e) => e._id === response.data._id);
              if (index >= 0) {
                apps[index] = response.data;
              } else {
                apps.push(response.data);
              }
              this._apps.next(apps);
              this._app.next(response.data);
              return of(response);
            }),
          ),
      ),
    );
  }

  update(projectId: string, appId: string, dto: UpdateAppReqDto) {
    return this._apps.pipe(
      take(1),
      switchMap((apps) =>
        this.httpClient
          .patch<ApiResponse<AppResDto>>(
            this.configService.endpoint(`/projects/${projectId}/apps/${appId}`),
            dto,
          )
          .pipe(
            switchMap((response: ApiResponse<AppResDto>) => {
              if (!apps || !(apps instanceof Array)) {
                apps = [];
              }
              const index = apps.findIndex((e) => e._id === response.data._id);
              if (index >= 0) {
                apps[index] = response.data;
              } else {
                apps.push(response.data);
              }
              this._apps.next(apps);
              this._app.next(response.data);
              return of(response);
            }),
          ),
      ),
    );
  }

  delete(projectId: string, appId: string) {
    return this._apps.pipe(
      take(1),
      switchMap((apps) =>
        this.httpClient
          .delete<ApiResponse<boolean>>(
            this.configService.endpoint(`/projects/${projectId}/apps/${appId}`),
          )
          .pipe(
            switchMap((response: ApiResponse<boolean>) => {
              if (!apps || !(apps instanceof Array)) {
                apps = [];
              }
              const index = apps.findIndex((e) => e._id === appId);
              if (index >= 0) {
                apps.splice(index);
              }
              this._apps.next(apps);
              this._app.next(null);
              return of(response);
            }),
          ),
      ),
    );
  }
}
