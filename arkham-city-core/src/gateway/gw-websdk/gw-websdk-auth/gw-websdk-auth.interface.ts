import { SDKJwtPayload } from 'src/modules/websdk/websdk-auth/websdl-auth.interface';

export interface GwWebSDKAuthReqDto {
  projectId: string;
  appId: string;
  secretKey: string;
  userToken?: string;
}

export interface GwWebSDKAuthLogInDto {
  email: string;
  password: string;
}

export interface GwWebSDKAuthRegisterDto {
  email: string;
  password: string;
}
