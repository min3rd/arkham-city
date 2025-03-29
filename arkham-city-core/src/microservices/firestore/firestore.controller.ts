import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateFirestoreRecord } from './firestore.type';
import { microserviceConfig } from 'src/config/microservice.config';
import { FirestoreService } from 'src/modules/firestore/firestore.service';

@Controller()
export class FirestoreController {
  constructor(private readonly firestoreService: FirestoreService) {}
  @MessagePattern(microserviceConfig.firestore.patterns.createRecord)
  createRecord(@Payload() payload: CreateFirestoreRecord) {
    return this.firestoreService.createRecord(
      payload.schemaName as string,
      payload.data,
    );
  }
}
