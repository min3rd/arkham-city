import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from '@core/services/config.service';
import { ApiResponse } from '../../../../projects/arkhamcity/src/lib/type/response.type';
import { Observable, map, of } from 'rxjs';
import { RoleResDto } from '@core/auth/auth.type';

export interface UpsertRolePayload {
  name: string;
  description?: string;
  permissions: string[];
  default?: boolean;
}

export type RoleAssignmentScope = 'global' | 'project' | 'resource';

export interface RoleUser {
  _id: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  superAdmin?: boolean;
}

export interface RoleAssignmentRes {
  _id: string;
  user?: RoleUser | string;
  role?: RoleResDto | string;
  scope: RoleAssignmentScope;
  projectId?: string;
  resourceId?: string;
}

export interface CreateRoleAssignmentPayload {
  userId: string;
  roleId: string;
  scope: RoleAssignmentScope;
  projectId?: string;
  resourceId?: string;
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

  listAssignments(
    filter: Partial<Pick<CreateRoleAssignmentPayload, 'roleId' | 'userId'>>,
  ): Observable<RoleAssignmentRes[]> {
    const params = new HttpParams({
      fromObject: {
        ...(filter.roleId ? { roleId: filter.roleId } : {}),
        ...(filter.userId ? { userId: filter.userId } : {}),
      },
    });
    return this.httpClient
      .get<ApiResponse<RoleAssignmentRes[]>>(
        this.configService.endpoint('/roles/assignments'),
        { params },
      )
      .pipe(map((res) => res.data ?? []));
  }

  createAssignment(
    payload: CreateRoleAssignmentPayload,
  ): Observable<RoleAssignmentRes> {
    return this.httpClient
      .post<ApiResponse<RoleAssignmentRes>>(
        this.configService.endpoint('/roles/assignments'),
        payload,
      )
      .pipe(map((res) => res.data));
  }

  deleteAssignment(assignmentId: string): Observable<boolean> {
    return this.httpClient
      .delete<ApiResponse<boolean>>(
        this.configService.endpoint(`/roles/assignments/${assignmentId}`),
      )
      .pipe(map((res) => res.data ?? false));
  }

  searchUsers(query: string, limit = 10): Observable<RoleUser[]> {
    const normalized = (query ?? '').trim();
    if (normalized.length < 2) {
      return of([]);
    }
    const params = new HttpParams({
      fromObject: {
        q: normalized,
        limit: limit.toString(),
      },
    });
    return this.httpClient
      .get<ApiResponse<RoleUser[]>>(
        this.configService.endpoint('/roles/users'),
        { params },
      )
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
