import { JWTPayload } from 'src/modules/auth/auth.interface';
import { APP_TYPE } from 'src/modules/project/app/project-app.type';

export interface CreateProjectAppReqPayload {
  user: JWTPayload;
  projectId: string;
  name: string;
  type: APP_TYPE;
  callback: string;
  description?: string;
}

export interface AllProjectAppReqPayload {
  user: JWTPayload;
  projectId: string;
}

export interface UpdateProjectAppReqPayload {
  user: JWTPayload;
  projectId: string;
  appId: string;
  name: string;
  type: APP_TYPE;
  callback: string;
  description?: string;
}

export interface DeleteProjectAppReqPayload {
  user: JWTPayload;
  projectId: string;
  appId: string;
}

export interface GetProjectAppReqPayload {
  user: JWTPayload;
  projectId: string;
  appId: string;
}

export interface GetProjectAppSecretReqPayload {
  user: JWTPayload;
  projectId: string;
  appId: string;
}
