import { JWTPayload } from '../../../modules/auth/auth.interface';

export interface MsQueryProjectFirestoreSchemaReqPayload {
  auth: JWTPayload;
  projectId: string;
  query?: object;
  page?: number;
  size?: number;
}
