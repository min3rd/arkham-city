import type { PermissionScopes } from '../user/user.permissions';

export interface RegisterByEmailAndPasswordDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LogInByEmailAndPassword {
  email: string;
  password: string;
}

export interface LogInByRefreshToken {
  refreshToken: string;
}

export type JWTType = 'dashboard' | 'websdk';

export interface JWTPayload {
  type: JWTType;
  sub?: string;
  username?: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
  permissionScopes?: PermissionScopes;
  superAdmin?: boolean;
}

export interface LogInResponseDto {
  accessToken?: string;
  refreshToken?: string;
  metadata?: any;
}

export interface RegisterResponseDto {
  username?: string;
  email?: string;
}
