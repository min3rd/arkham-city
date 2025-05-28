import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { SchemaResDto } from './schema.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '@core/services/config.service';
import { ApiResponse, Pagination, QueryReqDto } from 'arkhamcity';

@Injectable({
  providedIn: 'root',
})
export class SchemaService {
  private _pageSchema: BehaviorSubject<Pagination<SchemaResDto>> = new BehaviorSubject<any>(null);
  private _pageRecords: BehaviorSubject<Pagination<any>> = new BehaviorSubject<any>(null);
  private _record: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private readonly httpClient = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  get pageSchema$(): Observable<Pagination<SchemaResDto>> {
    return this._pageSchema;
  }

  get pageRecords$(): Observable<Pagination<any>> {
    return this._pageRecords;
  }

  get record$(): Observable<any> {
    return this._record.asObservable();
  }

  querySchemas(projectId: string, query: QueryReqDto) {
    return this.httpClient
      .get<ApiResponse<Pagination<SchemaResDto>>>(this.configService.endpoint(`/projects/${projectId}/schemas`), {
        params: new HttpParams({
          fromObject: {
            ...query,
            query: JSON.stringify(query.query),
          },
        }),
      })
      .pipe(switchMap((response) => {
        this._pageSchema.next(response.data);
        return of(response);
      }));
  }

  queryRecords(projectId: string, schema: string, query: QueryReqDto) {
    return this.httpClient
      .get<ApiResponse<Pagination<any>>>(this.configService.endpoint(`/projects/${projectId}/schemas/${schema}/records`), {
        params: new HttpParams({
          fromObject: {
            ...query,
            query: JSON.stringify(query.query),
          },
        }),
      })
      .pipe(switchMap((response) => {
        this._pageRecords.next(response.data);
        return of(response);
      }));
  }

  getRecord(projectId: string, schema: string, recordId: string) {
    return this.httpClient
      .get<ApiResponse<any>>(this.configService.endpoint(`/projects/${projectId}/schemas/${schema}/records/${recordId}`)).pipe(switchMap(reponse => {
        this._record.next(reponse.data);
        return of(reponse);
      }));
  }
}
