import { Injectable, Logger } from '@nestjs/common';
import {
  FirestoreDynamicSchemaSchema,
  FirestoreDynamicSchema,
  FirestoreSchemaField,
  FirestoreSchemaFieldSchema,
} from './firestore.type';
import { MongooseService } from '../mongoose/mongoose.service';
import { SDKJwtPayload } from '../websdk/websdk-auth/websdl-auth.interface';
import {
  BadMicroserviceResponse,
  MicroserviceErrorCode,
  MicroserviceResponse,
  SuccessMicroserviceResponse,
} from 'src/core/microservice/microservice.types';
import mongoose from 'mongoose';

@Injectable()
export class FirestoreService {
  private readonly logger = new Logger(FirestoreService.name);
  constructor(private readonly mongooseService: MongooseService) {}

  async createRecord(
    schemaName: string,
    data: any,
  ): Promise<MicroserviceResponse<any>> {
    this.logger.log(
      `createRecord:start:schemaName=${schemaName},data=${JSON.stringify(data)}`,
    );
    const record = await this.mongooseService.createRecord(
      this.mongooseService.createProjectConnection('test'),
      schemaName,
      data,
    );
    if (!record) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.COULD_NOT_SAVE_THE_RECORD,
      );
    }
    this.logger.log(`createRecord:end`);
    return new SuccessMicroserviceResponse(record.toJSON());
  }
  async webSDKCreateFirestoreRecord(
    auth: SDKJwtPayload,
    schemaName: string,
    data: any,
  ) {
    this.logger.log(
      `webSDKCreateFirestoreRecord:start:schemaName=${schemaName},data=${JSON.stringify(data)}`,
    );
    const preData = {
      ...data,
      project: {
        _id: auth.projectId,
      },
      auth: auth.username,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const record = await this.mongooseService.createRecord(
      this.mongooseService.createProjectConnection(auth.projectId as string),
      schemaName,
      preData,
    );
    if (!record) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.COULD_NOT_SAVE_THE_RECORD,
      );
    }
    this.logger.log(`webSDKCreateFirestoreRecord:end`);
    return new SuccessMicroserviceResponse(record.toJSON());
  }

  async webSDKStoreSchema(auth: SDKJwtPayload, schemaName: string, data: any) {
    const dataType = this.mongooseService.fromDataToType(data);
    const connection = this.mongooseService.createProjectConnection(
      auth.projectId as string,
    );
    let schemaModel = connection.model(
      FirestoreDynamicSchema.name,
      FirestoreDynamicSchemaSchema,
    );

    let fieldModel = connection.model(
      FirestoreSchemaField.name,
      FirestoreSchemaFieldSchema,
    );
    for (const _field of dataType) {
      const field = new fieldModel({
        name: _field,
        type: _field.type,
      });
    }
  }
}
