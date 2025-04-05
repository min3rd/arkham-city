import { Injectable } from '@nestjs/common';
import { DynamicSchema, Field } from './firestore.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadMicroserviceResponse,
  MicroserviceErrorCode,
  MicroserviceResponse,
  SuccessMicroserviceResponse,
} from 'src/core/microservice/microservice.type';
import { MongooseService } from '../mongoose/mongoose.service';

@Injectable()
export class FirestoreService {
  constructor(
    @InjectModel(DynamicSchema.name, 'firestore')
    private readonly dynamicModel: Model<DynamicSchema>,
    private readonly mongooseService: MongooseService,
  ) {}

  async createRecord(
    schemaName: string,
    data: any,
  ): Promise<MicroserviceResponse<any>> {
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
    return new SuccessMicroserviceResponse(record);
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
