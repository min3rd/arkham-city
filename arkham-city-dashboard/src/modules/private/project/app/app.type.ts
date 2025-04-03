export interface AppResDto {
  activated: boolean;
  name: string;
  description: string;
  type: string;
  callback: string;
  project: ProjectResDto;
  clientId: string;
  secretKey: string;
  user: UserResDto;
  _id: string;
  __v: number;
}

export interface ProjectResDto {
  _id: string;
}

export interface UserResDto {
  username: string;
}

export interface NewAppReqDto {
  name: string;
  type: string;
  callback: string;
  description?: string;
}

export interface UpdateAppReqDto {
  name: string;
  type: string;
  callback: string;
  description?: string;
}

export interface AppSecretResDto {
  secret: string;
}
