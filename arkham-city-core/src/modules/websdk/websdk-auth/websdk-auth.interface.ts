import { JWTPayload } from 'src/modules/auth/auth.interface';
import { WebSDKUser } from './websdk-auth.types';

export interface SDKAuthResDto {
  accessToken: string;
}

export interface SDKJwtPayload extends JWTPayload {
  projectId?: string;
  appId?: string;
}

export interface SDKEndUserAuthResDto {
  accessToken: string;
  user?: WebSDKUser;
}
