import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import mongoose, { Connection } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import moment from 'moment';

@Injectable()
export class MongooseService {
  private readonly logger = new Logger(MongooseService.name);
  private readonly schemaNameRegex = new RegExp(/[a-z]+/);
  constructor(private readonly configService: ConfigService) {}
  async createRecord(connection: Connection, schemaName: string, data: any) {
    if (!this.schemaNameRegex.exec(schemaName)) {
      throw new ForbiddenException();
    }
    const dataType = this.fromDataToType(data);
    const _Schema = new mongoose.Schema(dataType);
    const _Model = connection.model(schemaName, _Schema);
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
          if (moment(data[key], moment.ISO_8601, true).isValid()) {
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          dataType[key] = this.fromDataToType(data[key] as object);
        }
      }
    }
    return dataType;
  }
}
