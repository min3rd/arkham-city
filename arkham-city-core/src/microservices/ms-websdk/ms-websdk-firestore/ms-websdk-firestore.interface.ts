import { SDKJwtPayload } from 'src/modules/websdk/websdk-auth/websdl-auth.interface';

export interface MsWebsdkFirestoreStoreSchemaReqPayload {
  auth: SDKJwtPayload;
  schemaName: string;
  data: any;
}
