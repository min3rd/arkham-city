import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  FirestoreDynamicSchemaSchema,
  FirestoreSchemaField,
} from './firestore.types';
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
import mongoose, { Connection, Document } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { SchemaTypes } from 'mongoose';

@Injectable()
export class FirestoreService {
  private readonly schemaNameRegex = new RegExp(/[a-zA-Z]+/);
  private readonly logger = new Logger(FirestoreService.name);
  constructor(
    @Inject(microserviceConfig.websdk.firestore.name)
    private readonly clientProxy: ClientRedis,
    private readonly configService: ConfigService,
  ) {}

  async createRecord(
    schemaName: string,
    data: any,
  ): Promise<MicroserviceResponse<any>> {
    this.logger.log(`createRecord:start:`, schemaName, data);
    const record = await this._createRecord(
      this.createProjectConnection('test'),
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
    this.logger.log(`webSDKCreateFirestoreRecord`, auth, schemaName, data);
    const preData = {
      ...data,
      project: {
        _id: auth.projectId,
      },
      auth: auth.username,
    };
    const record = await this._createRecord(
      this.createProjectConnection(auth.projectId as string),
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
    this.logger.log(`webSDKStoreSchema:start:`, auth, schemaName, data);
    if (!this.schemaNameRegex.exec(schemaName)) {
      return new BadMicroserviceResponse(MicroserviceErrorCode.DEFAULT);
    }
    const connection = this.createProjectConnection(auth.projectId as string);
    const schemaModel = this.getFirestoreDynamicSchemaModel(connection);

    let dynamicSchema = await schemaModel.findOne({
      name: schemaName.toLowerCase(),
    });
    if (!dynamicSchema) {
      dynamicSchema = new schemaModel({
        name: schemaName.toLowerCase(),
      });
    }
    dynamicSchema.fields = this.fromDataToField(data);
    dynamicSchema = await dynamicSchema.save();
    this.logger.log(`webSDKStoreSchema:end`);
    return new SuccessMicroserviceResponse(dynamicSchema.toJSON());
  }

  async webSDKQueryRecord(auth: SDKJwtPayload, schemeName: string, query: any) {
    this.logger.log(`webSDKQueryRecord:start`, auth, schemeName, query);
    const connection = this.createProjectConnection(auth.projectId as string);
    const recordModel = await this.getRecordModel(connection, schemeName);
    if (!recordModel) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.WEB_SDK_FIRESTORE_COULD_NOT_FOUND_SCHEMA,
      );
    }
    const records = await recordModel.find(query);
    this.logger.log(`webSDKQueryRecord:end`);
    return new SuccessMicroserviceResponse(records.map((e) => e.toJSON()));
  }

  async webSDKFindById(auth: SDKJwtPayload, schemaName: string, id: string) {
    this.logger.log(`webSDKGetRecord:start`, auth, schemaName, id);
    const connection = this.createProjectConnection(auth.projectId as string);
    const recordModel = await this.getRecordModel(connection, schemaName);
    if (!recordModel) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.WEB_SDK_FIRESTORE_COULD_NOT_FOUND_SCHEMA,
      );
    }
    const record = await recordModel.findById(id);
    this.logger.log(`webSDKGetRecord:end`);
    return new SuccessMicroserviceResponse(record?.toJSON());
  }

  async webSDKPartialUpdate(
    auth: SDKJwtPayload,
    schemaName: string,
    id: string,
    data: any,
  ) {
    this.logger.log('webSDKPartialUpdate:start', auth, schemaName, id, data);
    const connection = this.createProjectConnection(auth.projectId as string);
    const recordModel = await this.getRecordModel(connection, schemaName);
    if (!recordModel) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.WEB_SDK_FIRESTORE_COULD_NOT_FOUND_SCHEMA,
      );
    }
    let record = await recordModel.findById(id);
    if (!record) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.WEB_SDK_FIRESTORE_COULD_NOT_FOUND_RECORD,
      );
    }

    if (record._id != data._id) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.WEB_SDK_FIRESTORE_ID_WAS_NOT_MATCHED,
      );
    }
    record = await recordModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        ...record.toJSON(),
        ...data,
      },
      {
        new: true,
      },
    );
    this.logger.log('webSDKPartialUpdate:end');
    return new SuccessMicroserviceResponse(record?.toJSON());
  }

  async webSDKUpdate(
    auth: SDKJwtPayload,
    schemaName: string,
    id: string,
    data: any,
  ) {
    this.logger.log('webSDKUpdate:start', auth, schemaName, id, data);
    const connection = this.createProjectConnection(auth.projectId as string);
    const recordModel = await this.getRecordModel(connection, schemaName);
    if (!recordModel) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.WEB_SDK_FIRESTORE_COULD_NOT_FOUND_SCHEMA,
      );
    }
    let record = await recordModel.findById(id);
    if (!record) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.WEB_SDK_FIRESTORE_COULD_NOT_FOUND_RECORD,
      );
    }
    if (record._id != data._id) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.WEB_SDK_FIRESTORE_ID_WAS_NOT_MATCHED,
      );
    }
    record = await recordModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        ...data,
      },
      {
        new: true,
      },
    );
    this.logger.log('webSDKUpdate:end');
    return new SuccessMicroserviceResponse(record?.toJSON());
  }

  async webSDKDeleteById(auth: SDKJwtPayload, schemaName: string, id: string) {
    this.logger.log('webSDKDelete:start', auth, schemaName, id);
    const connection = this.createProjectConnection(auth.projectId as string);
    const recordModel = await this.getRecordModel(connection, schemaName);
    if (!recordModel) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.WEB_SDK_FIRESTORE_COULD_NOT_FOUND_SCHEMA,
      );
    }
    let record = await recordModel.findById(id);
    if (!record) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.WEB_SDK_FIRESTORE_COULD_NOT_FOUND_RECORD,
      );
    }
    await record.deleteOne();
    this.logger.log('webSDKDelete:end');
    return new SuccessMicroserviceResponse(true);
  }

  async _createRecord(connection: Connection, schemaName: string, data: any) {
    if (!this.schemaNameRegex.exec(schemaName)) {
      return null;
    }
    const dataType = this.fromDataToType(data);
    this.logger.debug(`createRecord:dataType=${JSON.stringify(dataType)}`);
    const _Schema = new mongoose.Schema(dataType);
    const _Model = connection.model(schemaName.toLowerCase(), _Schema);
    const record = new _Model(data);
    return await record.save();
  }

  async getRecordModel(connection: Connection, schemeName: string) {
    const dynamicSchemaModel = this.getFirestoreDynamicSchemaModel(connection);
    const dynamicSchema = await dynamicSchemaModel.findOne({
      name: schemeName.toLowerCase(),
    });
    if (!dynamicSchema) {
      return null;
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
      } else if (field.type === SchemaTypes.Mixed.name) {
        schema[field.name] = {
          type: SchemaTypes.Mixed,
        };
      }
    }
    return connection.model(
      schemeName.toLowerCase(),
      new mongoose.Schema(schema),
    );
  }

  getFirestoreDynamicSchemaModel(connection: Connection) {
    return connection.model('dynamic-schemas', FirestoreDynamicSchemaSchema);
  }

  fromDataToField(data: object) {
    const fields: FirestoreSchemaField[] = [];
    for (const key of Object.keys(data)) {
      let type;
      if (data[key] == null || data[key] == undefined) {
        type = SchemaTypes.Mixed.name;
      } else if (typeof data[key] === 'string') {
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

  createConnection(mongoUrl: string, poolSize: number = 10): Connection {
    return mongoose.createConnection(mongoUrl, { maxPoolSize: poolSize });
  }

  createProjectConnection(
    projectId: string,
    poolSize: number = 10,
  ): Connection {
    let mongoUrl: string = this.configService.get('MONGO_DB_URL') as string;
    if (mongoUrl.endsWith('/')) {
      mongoUrl = mongoUrl.substring(0, mongoUrl.length - 1);
    }
    const connectionString = `${mongoUrl}/projects_${projectId}`;
    return this.createConnection(connectionString, poolSize);
  }

  fromDataToType(data: object) {
    if (typeof data !== 'object') {
      return false;
    }
    if (data instanceof Array) {
      return this.fromDataToType(data.pop());
    }
    const dataType = {};
    for (const key of Object.keys(data)) {
      if (data[key] == null || data[key] === undefined) {
        dataType[key] = {
          type: SchemaTypes.Mixed,
        };
      } else if (typeof data[key] === 'string') {
        dataType[key] = {
          type: String,
        };
        try {
          if (moment(data[key], ISO_8601, true).isValid()) {
            this.logger.log(key);
            dataType[key] = {
              type: Date,
            };
          }
        } catch (e) {}
      } else if (typeof data[key] === 'number') {
        dataType[key] = {
          type: Number,
        };
      } else if (typeof data[key] === 'bigint') {
        dataType[key] = {
          type: BigInt,
        };
      } else if (typeof data[key] === 'boolean') {
        dataType[key] = {
          type: Boolean,
        };
      } else if (typeof data[key] === 'object') {
        if (data[key] instanceof Array) {
          dataType[key] = {
            type: Array,
          };
        } else {
          dataType[key] = this.fromDataToType(data[key] as object);
        }
      }
    }
    return dataType;
  }

  update(record: Document<any>, data: any): Document<any> {
    for (const key in data) {
      if (key == '_id' || key == '__v') {
        continue;
      }
      record[key] = data[key];
    }
    return record;
  }
}
