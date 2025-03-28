export interface LogInResDto {
  accessToken: string;
  refreshToken: string;
  metadata: User;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  __v?: number;
  avatar?: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

export interface RegisterResDto {}
