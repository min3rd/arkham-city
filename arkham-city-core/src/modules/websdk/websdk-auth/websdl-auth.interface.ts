import { JWTPayload } from "src/modules/auth/auth.interface";

export interface SDKAuthResDto {
  accessToken: string;
}

export interface SDKJwtPayload extends JWTPayload {
  projectId?: string;
  appId?: string;
}
