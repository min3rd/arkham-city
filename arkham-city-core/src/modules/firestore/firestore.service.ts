import { Inject, Injectable } from '@nestjs/common';
import { DynamicSchema, Field } from './firestore.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/modules/base/base.service';
import { microserviceConfig } from 'src/config/microservice.config';
import { ClientRedis } from '@nestjs/microservices';
import {
  BadMicroserviceResponse,
  MicroserviceErrorCode,
  MicroserviceResponse,
  SuccessMicroserviceResponse,
} from 'src/core/microservice/microservice.type';
import { firstValueFrom } from 'rxjs';
import { CreateFirestoreRecord } from 'src/microservices/firestore/firestore.type';
import { MongooseService } from '../mongoose/mongoose.service';

@Injectable()
export class FirestoreService extends BaseService {
  constructor(
    @InjectModel(DynamicSchema.name, 'firestore')
    private readonly dynamicModel: Model<DynamicSchema>,
    @Inject(microserviceConfig.firestore.name)
    private readonly client: ClientRedis,
    private readonly mongooseService: MongooseService,
  ) {
    super();
  }
  async callCreateRecord(schemaName: string, data: any) {
    const payload: CreateFirestoreRecord = {
      schemaName: schemaName,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: data,
    };
    const res: MicroserviceResponse<any> = await firstValueFrom(
      this.client.send(
        microserviceConfig.firestore.patterns.createRecord,
        payload,
      ),
    );
    this.afterCallMicroservice(res);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res.data;
  }

  async createRecord(
    schemaName: string,
    data: any,
  ): Promise<MicroserviceResponse<any>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
    const record = await this.mongooseService.createRecord(schemaName, data);
    if (!record) {
      return new BadMicroserviceResponse(MicroserviceErrorCode.DEFAULT);
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
