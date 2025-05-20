import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { SchemaResDto } from './schema.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '@core/services/config.service';
import { ApiResponse, Pagination, QueryReqDto } from 'arkhamcity';

@Injectable({
  providedIn: 'root',
})
export class SchemaService {
  private _schemas: BehaviorSubject<SchemaResDto[]> = new BehaviorSubject<SchemaResDto[]>([]);
  private _records: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private _pageSchema: BehaviorSubject<Pagination<SchemaResDto>> = new BehaviorSubject<any>(null);

  private readonly httpClient = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  get schemas$(): BehaviorSubject<SchemaResDto[]> {
    return this._schemas;
  }

  get records$(): BehaviorSubject<any[]> {
    return this._records;
  }

  get pageSchema$(): BehaviorSubject<Pagination<SchemaResDto>> {
    return this._pageSchema;
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
        this._schemas.next(response.data.data);
        this._pageSchema.next(response.data);
        return of(response);
      }));
  }

  queryRecords(projectId: string, schema: string, query: QueryReqDto) {
    return this.httpClient
      .get<ApiResponse<any[]>>(this.configService.endpoint(`/projects/${projectId}/schemas/${schema}/records`), {
        params: new HttpParams({
          fromObject: {
            ...query,
            query: JSON.stringify(query.query),
          },
        }),
      })
      .pipe(switchMap((response) => {
        this._records.next(response.data);
        return of(response);
      }));
  }
}
