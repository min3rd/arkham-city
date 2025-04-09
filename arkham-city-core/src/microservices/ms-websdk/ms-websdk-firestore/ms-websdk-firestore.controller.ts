import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { CreateFirestoreRecordReqPayload } from 'src/microservices/ms-firestore/ms-firestore.interface';
import { FirestoreService } from 'src/modules/firestore/firestore.service';
import {
  MsWebSDKFirestoreQuerySchemaReqPayload,
  MsWebSDKFirestoreStoreSchemaReqPayload,
} from './ms-websdk-firestore.interface';

@Controller('')
export class MsWebsdkFirestoreController {
  constructor(private readonly firestoreService: FirestoreService) {}
  @MessagePattern(microserviceConfig.websdk.firestore.patterns.createRecord)
  createRecord(@Payload() payload: CreateFirestoreRecordReqPayload) {
    return this.firestoreService.webSDKCreateFirestoreRecord(
      payload.auth,
      payload.schemaName as string,
      payload.data,
    );
  }

  @MessagePattern(microserviceConfig.websdk.firestore.patterns.storeSchema)
  storeSchema(@Payload() payload: MsWebSDKFirestoreStoreSchemaReqPayload) {
    return this.firestoreService.webSDKStoreSchema(
      payload.auth,
      payload.schemaName,
      payload.data,
    );
  }

  @MessagePattern(microserviceConfig.websdk.firestore.patterns.querySchema)
  querySchema(@Payload() payload: MsWebSDKFirestoreQuerySchemaReqPayload) {
    return this.firestoreService.webSDKQueryRecord(
      payload.auth,
      payload.schemaName,
      payload.query,
    );
  }
}
