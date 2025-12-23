import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from '@core/services/config.service';
import { ApiResponse } from '../../../../projects/arkhamcity/src/lib/type/response.type';
import { Observable, map } from 'rxjs';
import { RoleResDto } from '@core/auth/auth.type';

export interface UpsertRolePayload {
  name: string;
  description?: string;
  permissions: string[];
  default?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private httpClient: HttpClient = inject(HttpClient);
  private configService: ConfigService = inject(ConfigService);

  list(): Observable<RoleResDto[]> {
    return this.httpClient
      .get<ApiResponse<RoleResDto[]>>(this.configService.endpoint('/roles'))
      .pipe(map((res) => res.data ?? []));
  }

  create(payload: UpsertRolePayload): Observable<RoleResDto> {
    return this.httpClient
      .post<ApiResponse<RoleResDto>>(
        this.configService.endpoint('/roles'),
        payload,
      )
      .pipe(map((res) => res.data));
  }

  update(roleId: string, payload: UpsertRolePayload): Observable<RoleResDto> {
    return this.httpClient
      .put<ApiResponse<RoleResDto>>(
        this.configService.endpoint(`/roles/${roleId}`),
        payload,
      )
      .pipe(map((res) => res.data));
  }

  delete(roleId: string): Observable<boolean> {
    return this.httpClient
      .delete<ApiResponse<boolean>>(
        this.configService.endpoint(`/roles/${roleId}`),
      )
      .pipe(map((res) => res.data ?? false));
  }
}
