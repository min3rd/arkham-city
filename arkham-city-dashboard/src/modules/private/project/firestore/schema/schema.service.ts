import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { SchemaResDto } from './schema.types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { QueryReqDto } from '../../../../../core/type/request.types';
import { ApiResponse } from '../../../../../core/type/response.type';
import { ConfigService } from '../../../../../core/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class SchemaService {
  private _schemas: BehaviorSubject<SchemaResDto[]> = new BehaviorSubject<SchemaResDto[]>([]);

  private readonly httpClient = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  get schemas$(): BehaviorSubject<SchemaResDto[]> {
    return this._schemas;
  }

  querySchemas(projectId: string, query: QueryReqDto) {
    return this.httpClient
      .get<ApiResponse<SchemaResDto[]>>(this.configService.endpoint(`/projects/${projectId}/schemas`), {
        params: new HttpParams({
          fromObject: {
            ...query,
            query: JSON.stringify(query.query),
          },
        }),
      })
      .pipe(switchMap((response) => {
        this._schemas.next(response.data);
        return of(response);
      }));
  }
}
