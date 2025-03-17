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
