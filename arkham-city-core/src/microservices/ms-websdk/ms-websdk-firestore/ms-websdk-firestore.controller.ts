import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { CreateFirestoreRecordReqPayload } from 'src/microservices/ms-firestore/ms-firestore.interface';
import { FirestoreService } from 'src/modules/firestore/firestore.service';

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
}
