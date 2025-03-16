export interface RegisterByEmailAndPasswordDto {
  email: string;
  username: string;
  password: string;
}

export interface LogInByEmailAndPassword {
  email: string;
  password: string;
}

export interface JWTPayload {
  sub?: string;
  username?: string;
  email?: string;
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
