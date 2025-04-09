import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirestoreService } from './firestore.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { MongooseService } from '../mongoose/mongoose.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: microserviceConfig.firestore.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST as string,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
      {
        name: microserviceConfig.websdk.firestore.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST as string,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
    ]),
  ],
  providers: [MongooseService, FirestoreService],
  exports: [FirestoreService],
})
export class FirestoreModule {}
