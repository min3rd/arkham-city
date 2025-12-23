export interface LogInResDto {
  accessToken: string;
  refreshToken: string;
  metadata: UserResDto;
}

export interface RoleResDto {
  _id?: string;
  name: string;
  description?: string;
  permissions?: string[];
  default?: boolean;
}

export interface PermissionScopes {
  system?: string[];
  project?: string[];
}

export interface UserResDto {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: RoleResDto[];
  permissions?: string[];
  permissionScopes?: PermissionScopes;
  __v?: number;
  avatar?: string;
}

export interface RegisterReqDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

export interface RegisterResDto {
  username: string;
  email: string;
}
