import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateFirestoreRecord } from './ms-firestore.interface';
import { microserviceConfig } from 'src/config/microservice.config';
import { FirestoreService } from 'src/modules/firestore/firestore.service';

@Controller()
export class MsFirestoreController {
  constructor(private readonly firestoreService: FirestoreService) {}
  @MessagePattern(microserviceConfig.firestore.patterns.createRecord)
  createRecord(@Payload() payload: CreateFirestoreRecord) {
    return this.firestoreService.createRecord(
      payload.schemaName as string,
      payload.data,
    );
  }
}
