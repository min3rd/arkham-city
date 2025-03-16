import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateFirestoreRecord } from './firestore.type';
import { microserviceConfig } from 'src/config/microservice.config';
import { FirestoreService } from 'src/modules/firestore/firestore.service';

@Controller('firestore')
export class FirestoreController {
  constructor(private readonly firestoreService: FirestoreService) {}
  @MessagePattern(microserviceConfig.firestore.patterns.createRecord)
  createRecord(@Payload() payload: CreateFirestoreRecord) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.firestoreService.createRecord(
      payload.schemaName as string,
      payload.data,
    );
  }
}
