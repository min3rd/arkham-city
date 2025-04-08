import { Injectable, Logger } from '@nestjs/common';
import { DynamicSchema, Field } from './firestore.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadMicroserviceResponse,
  MicroserviceErrorCode,
  MicroserviceResponse,
  SuccessMicroserviceResponse,
} from 'src/core/microservice/microservice.types';
import { MongooseService } from '../mongoose/mongoose.service';
import { SDKJwtPayload } from '../websdk/websdk-auth/websdl-auth.interface';

@Injectable()
export class FirestoreService {
  private readonly logger = new Logger(FirestoreService.name);
  constructor(
    @InjectModel(DynamicSchema.name, 'firestore')
    private readonly dynamicModel: Model<DynamicSchema>,
    private readonly mongooseService: MongooseService,
  ) {}

  async createRecord(
    schemaName: string,
    data: any,
  ): Promise<MicroserviceResponse<any>> {
    this.logger.log(
      `createRecord:start:schemaName=${schemaName},data=${JSON.stringify(data)}`,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

  async storeSchema(schemaName: string, fields: Field[]) {
    let dynamicSchema = new this.dynamicModel({
      name: schemaName,
      fields: fields,
    });
    dynamicSchema = await dynamicSchema.save();
    return dynamicSchema;
  }
}
