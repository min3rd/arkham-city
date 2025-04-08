import { JWTPayload } from 'src/modules/auth/auth.interface';

export interface NewProjectReqPayload {
  user: JWTPayload;
  name: string;
  description: string;
}

export interface GetProjectByIdReqPayload {
  user: JWTPayload;
  projectId: string;
}
