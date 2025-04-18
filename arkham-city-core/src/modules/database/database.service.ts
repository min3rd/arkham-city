import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose, { Connection } from 'mongoose';

@Injectable()
export class DatabaseService {
  constructor(private readonly configService: ConfigService) {}

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
}
