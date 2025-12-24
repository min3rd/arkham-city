import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from '@core/services/config.service';
import { ApiResponse } from 'arkhamcity';
import { RoleResDto } from '@core/auth/auth.type';
import { catchError, map, of } from 'rxjs';

export type UserStatus = 'active' | 'disabled';

export interface UserListItem {
  _id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  roles?: RoleResDto[];
  status?: UserStatus;
  lastActiveAt?: string;
  createdAt?: string;
}

export interface UserListResult {
  items: UserListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface UpsertUserPayload {
  email: string;
  password?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  roles?: string[];
  status?: UserStatus;
}

export interface ListUsersQuery {
  search?: string;
  roles?: string[];
  status?: UserStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly httpClient = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  list(query: ListUsersQuery = {}) {
    let params = new HttpParams();
    if (query.search) {
      params = params.set('search', query.search);
    }
    if (query.roles?.length) {
      query.roles.forEach((role) => {
        params = params.append('roles', role);
      });
    }
    if (query.status) {
      params = params.set('status', query.status);
    }
    if (query.page) {
      params = params.set('page', `${query.page}`);
    }
    if (query.limit) {
      params = params.set('limit', `${query.limit}`);
    }
    if (query.sortBy) {
      params = params.set('sortBy', query.sortBy);
    }
    if (query.sortOrder) {
      params = params.set('sortOrder', query.sortOrder);
    }
    return this.httpClient
      .get<ApiResponse<UserListResult>>(this.configService.endpoint('/users'), {
        params,
      })
      .pipe(
        map(
          (res) =>
            res.data ?? {
              items: [],
              total: 0,
              page: 1,
              limit: query.limit ?? 10,
            },
        ),
        catchError(() =>
          of({
            items: [],
            total: 0,
            page: 1,
            limit: query.limit ?? 10,
          }),
        ),
      );
  }

  get(userId: string) {
    return this.httpClient
      .get<ApiResponse<UserListItem>>(
        this.configService.endpoint(`/users/${userId}`),
      )
      .pipe(map((res) => res.data));
  }

  create(payload: UpsertUserPayload) {
    return this.httpClient
      .post<ApiResponse<UserListItem>>(
        this.configService.endpoint('/users'),
        payload,
      )
      .pipe(map((res) => res.data));
  }

  update(userId: string, payload: UpsertUserPayload) {
    return this.httpClient
      .put<ApiResponse<UserListItem>>(
        this.configService.endpoint(`/users/${userId}`),
        payload,
      )
      .pipe(map((res) => res.data));
  }

  setStatus(userId: string, status: UserStatus) {
    return this.httpClient
      .patch<ApiResponse<UserListItem>>(
        this.configService.endpoint(`/users/${userId}/status`),
        { status },
      )
      .pipe(map((res) => res.data));
  }

  assignRoles(userId: string, roles: string[]) {
    return this.httpClient
      .post<ApiResponse<UserListItem>>(
        this.configService.endpoint(`/users/${userId}/roles`),
        { roles },
      )
      .pipe(map((res) => res.data));
  }

  delete(userId: string) {
    return this.httpClient
      .delete<ApiResponse<boolean>>(
        this.configService.endpoint(`/users/${userId}`),
      )
      .pipe(map((res) => res.data ?? false));
  }
}
