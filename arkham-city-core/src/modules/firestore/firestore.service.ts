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
import { MsWebSDKFirestoreStoreSchemaReqPayload } from 'src/microservices/ms-websdk/ms-websdk-firestore/ms-websdk-firestore.interface';
import moment, { ISO_8601 } from 'moment';
import mongoose, { Connection } from 'mongoose';

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
      `webSDKCreateFirestoreRecord:start:auth=${JSON.stringify(auth)},schemaName=${schemaName},data=${JSON.stringify(data)}`,
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
    const payload: MsWebSDKFirestoreStoreSchemaReqPayload = {
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
      `webSDKStoreSchema:start:auth=${JSON.stringify(auth)},schemaName=${schemaName},data=${JSON.stringify(data)}`,
    );
    if (!MongooseService.schemaNameRegex.exec(schemaName)) {
      return new BadMicroserviceResponse(MicroserviceErrorCode.DEFAULT);
    }
    const connection = this.mongooseService.createProjectConnection(
      auth.projectId as string,
    );
    const schemaModel = this.getFirestoreDynamicSchemaModel(connection);

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

  async webSDKQueryRecord(auth: SDKJwtPayload, schemeName: string, query: any) {
    this.logger.log(
      `webSDKQueryRecord:start:auth=${JSON.stringify(auth)},schemeName=${schemeName},query=${JSON.stringify(query)}`,
    );
    const connection = this.mongooseService.createProjectConnection(
      auth.projectId as string,
    );
    const dynamicSchemaModel = this.getFirestoreDynamicSchemaModel(connection);
    const dynamicSchema = await dynamicSchemaModel.findOne({
      name: schemeName.toLowerCase(),
    });
    if (!dynamicSchema) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.WEB_SDK_FIRESTORE_COULD_NOT_FOUND_SCHEMA,
      );
    }
    const schema = {};
    for (const field of dynamicSchema.fields) {
      if (field.type === String.name) {
        schema[field.name] = {
          type: String,
        };
      } else if (field.type === Date.name) {
        schema[field.name] = {
          type: Date,
        };
      } else if (field.type === Number.name) {
        schema[field.name] = {
          type: Number,
        };
      } else if (field.type === BigInt.name) {
        schema[field.name] = {
          type: BigInt,
        };
      } else if (field.type === Boolean.name) {
        schema[field.name] = {
          type: Boolean,
        };
      } else if (field.type === Object.name) {
        schema[field.name] = {
          type: Object,
        };
      } else if (field.type === Array.name) {
        schema[field.name] = {
          type: Array,
        };
      }
    }
    const recordModel = connection.model(
      schemeName.toLowerCase(),
      new mongoose.Schema(schema),
    );
    const records = await recordModel.find(query);
    this.logger.log(`webSDKQueryRecord:end`);
    return new SuccessMicroserviceResponse(records.map((e) => e.toJSON()));
  }

  getFirestoreDynamicSchemaModel(connection: Connection) {
    return connection.model(
      FirestoreDynamicSchema.name,
      FirestoreDynamicSchemaSchema,
    );
  }

  formData(data: object) {
    const fields: FirestoreSchemaField[] = [];
    for (const key of Object.keys(data)) {
      let type;
      if (typeof data[key] === 'string') {
        type = String.name;
        try {
          if (moment(data[key], ISO_8601, true).isValid()) {
            type = Date.name;
          }
        } catch (e) {}
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
