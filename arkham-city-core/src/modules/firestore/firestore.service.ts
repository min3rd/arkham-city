import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  FirestoreDynamicSchemaSchema,
  FirestoreDynamicSchema,
  FirestoreSchemaField,
} from './firestore.types';
import { MongooseService } from '../mongoose/mongoose.service';
import { SDKJwtPayload } from '../websdk/websdk-auth/websdl-auth.interface';
import {
  BadMicroserviceResponse,
  MicroserviceErrorCode,
  MicroserviceResponse,
  SuccessMicroserviceResponse,
} from 'src/core/microservice/microservice.types';
import { microserviceConfig } from 'src/config/microservice.config';
import { ClientRedis } from '@nestjs/microservices';
import { MsWebsdkFirestoreStoreSchemaReqPayload } from 'src/microservices/ms-websdk/ms-websdk-firestore/ms-websdk-firestore.interface';
import moment from 'moment';

@Injectable()
export class FirestoreService {
  private readonly logger = new Logger(FirestoreService.name);
  constructor(
    private readonly mongooseService: MongooseService,
    @Inject(microserviceConfig.websdk.firestore.name)
    private readonly clientProxy: ClientRedis,
  ) {}

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
    const payload: MsWebsdkFirestoreStoreSchemaReqPayload = {
      auth: auth,
      schemaName: schemaName,
      data: data,
    };
    this.clientProxy.emit(
      microserviceConfig.websdk.firestore.patterns.storeSchema,
      payload,
    );
    return new SuccessMicroserviceResponse(record.toJSON());
  }

  async webSDKStoreSchema(auth: SDKJwtPayload, schemaName: string, data: any) {
    this.logger.log(
      `webSDKStoreSchema:start:auth=${auth},schemaName=${schemaName},data=${data}`,
    );
    if (!MongooseService.schemaNameRegex.exec(schemaName)) {
      return new BadMicroserviceResponse(MicroserviceErrorCode.DEFAULT);
    }
    const connection = this.mongooseService.createProjectConnection(
      auth.projectId as string,
    );
    const schemaModel = connection.model(
      FirestoreDynamicSchema.name,
      FirestoreDynamicSchemaSchema,
    );

    let dynamicSchema = await schemaModel.findOne({
      name: schemaName.toLowerCase(),
    });
    if (!dynamicSchema) {
      dynamicSchema = new schemaModel({
        name: schemaName.toLowerCase(),
      });
    }
    dynamicSchema.fields = this.formData(data);
    dynamicSchema = await dynamicSchema.save();
    this.logger.log(`webSDKStoreSchema:end`);
    return new SuccessMicroserviceResponse(dynamicSchema.toJSON());
  }

  formData(data: object) {
    const fields: FirestoreSchemaField[] = [];
    for (const key of Object.keys(data)) {
      let type;
      if (typeof data[key] === 'string') {
        type = String.name;
        try {
          if (moment(data[key], moment.ISO_8601, true).isValid()) {
            type = Date.name;
          }
        } catch (e) {
          console.error(e);
        }
      } else if (typeof data[key] === 'number') {
        type = Number.name;
      } else if (typeof data[key] === 'bigint') {
        type = BigInt.name;
      } else if (typeof data[key] === 'boolean') {
        type = Boolean.name;
      } else if (typeof data[key] === 'object') {
        type = Object.name;
        if (data[key] instanceof Array) {
          type = Array.name;
        }
      }
      const field: FirestoreSchemaField = {
        name: key,
        type: type,
      };
      fields.push(field);
    }
    return fields;
  }
}
