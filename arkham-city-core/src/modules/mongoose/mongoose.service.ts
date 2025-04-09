import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import mongoose, { Connection } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import moment, { ISO_8601 } from 'moment';

@Injectable()
export class MongooseService {
  private readonly logger = new Logger(MongooseService.name);
  public static readonly schemaNameRegex = new RegExp(/[a-zA-Z]+/);
  constructor(private readonly configService: ConfigService) {}
  async createRecord(connection: Connection, schemaName: string, data: any) {
    if (!MongooseService.schemaNameRegex.exec(schemaName)) {
      throw new ForbiddenException();
    }
    const dataType = this.fromDataToType(data);
    this.logger.debug(`createRecord:dataType=${JSON.stringify(dataType)}`);
    const _Schema = new mongoose.Schema(dataType);
    const _Model = connection.model(schemaName.toLowerCase(), _Schema);
    const record = new _Model(data);
    return await record.save();
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
      if (typeof data[key] === 'string') {
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
}
