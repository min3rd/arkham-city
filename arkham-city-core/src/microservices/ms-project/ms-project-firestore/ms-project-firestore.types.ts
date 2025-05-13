import { JWTPayload } from '../../../modules/auth/auth.interface';

export interface MsQueryProjectFirestoreSchemaReqPayload {
  auth: JWTPayload;
  projectId: string;
  query?: object;
  page?: number;
  size?: number;
}

export interface MsQueryProjectFirestoreSchemaRecordsReqPayload {
  auth: JWTPayload;
  projectId: string;
  schemaName: string;
  query?: object;
  page?: number;
  size?: number;
}

export interface MsGetProjectFirestoreSchemaRecordReqPayload {
  auth: JWTPayload;
  projectId: string;
  schemaName: string;
  id: string;
}

export interface MsCreateProjectFirestoreSchemaRecordReqPayload {
  auth: JWTPayload;
  projectId: string;
  schemaName: string;
  data: object;
}

export interface MsUpdateProjectFirestoreSchemaRecordReqPayload {
  auth: JWTPayload;
  projectId: string;
  schemaName: string;
  id: string;
  data: object;
}

export interface MsDeleteProjectFirestoreSchemaRecordReqPayload {
  auth: JWTPayload;
  projectId: string;
  schemaName: string;
  id: string;
}
