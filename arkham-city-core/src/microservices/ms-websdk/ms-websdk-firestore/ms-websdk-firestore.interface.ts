import { SDKJwtPayload } from 'src/modules/websdk/websdk-auth/websdl-auth.interface';

export interface MsWebSDKFirestoreStoreSchemaReqPayload {
  auth: SDKJwtPayload;
  schemaName: string;
  data: any;
}

export interface MsWebSDKFirestoreQuerySchemaReqPayload {
  auth: SDKJwtPayload;
  schemaName: string;
  query?: any;
}

export interface MsWebSDKFirestoreFindByIdReqPayload {
  auth: SDKJwtPayload;
  schemaName: string;
  id: string;
}

export interface MsWebSDKFirestoreUpdateReqPayload {
  auth: SDKJwtPayload;
  schemaName: string;
  id: string;
  data: any;
}
