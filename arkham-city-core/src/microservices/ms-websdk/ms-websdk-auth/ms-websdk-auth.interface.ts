import { SDKJwtPayload } from 'src/modules/websdk/websdk-auth/websdl-auth.interface';

export interface MsWebSDKAuthReqPayload {
  projectId: string;
  appId: string;
  secretKey: string;
  userToken?: string;
}

export interface MsWebSDKAuthLogInReqPayload {
  auth: SDKJwtPayload;
  email: string;
  password: string;
}

export interface MsWebSDKAuthRegisterReqPayload {
  auth: SDKJwtPayload;
  email: string;
  password: string;
}
