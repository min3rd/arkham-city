import { ForbiddenException, Injectable } from '@nestjs/common';
import mongoose, { Connection } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongooseService {
  private readonly schemaNameRegex = new RegExp(/[a-z]/);
  constructor(private readonly configService: ConfigService) {}
  async createRecord(connection: Connection, schemaName: string, data: any) {
    if (!this.schemaNameRegex.exec(schemaName)) {
      throw new ForbiddenException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    const dataType = this.fromDataToType(data);
    const _Schema = new mongoose.Schema(dataType);
    const _Model = connection.model(schemaName, _Schema);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const record = new _Model(data);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await record.save();
  }

  createFirestoreConnection(): Connection {
    return mongoose.createConnection(
      this.configService.get('MONGO_DB_FIRESTORE') as string,
    );
  }

  createConnection(mongoUrl: string): Connection {
    return mongoose.createConnection(mongoUrl);
  }

  createProjectConnection(projectId: string): Connection {
    const mongoUrl: string = this.configService.get('MONGO_DB_URL') as string;
    const connectionString = `${mongoUrl}projects_${projectId}`;
    return this.createConnection(connectionString);
  }

  fromDataToType(data: object) {
    if (typeof data !== 'object') {
      return false;
    }
    if (data instanceof Array) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
      return this.fromDataToType(data.pop());
    }
    const dataType = {};
    for (const key of Object.keys(data)) {
      if (typeof data[key] === 'string') {
        dataType[key] = {
          type: String,
        };
        try {
          const date = Date.parse(`${data[key]}`);
          if (!isNaN(date)) {
            dataType[key] = {
              type: Date,
            };
          }
        } catch (error) {
          console.log(error);
        }
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
