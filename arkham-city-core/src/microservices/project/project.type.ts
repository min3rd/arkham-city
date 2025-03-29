import { JWTPayload } from 'src/modules/auth/auth.type';

export interface NewProjectReqPayload {
  user: JWTPayload;
  name: string;
  description: string;
}
