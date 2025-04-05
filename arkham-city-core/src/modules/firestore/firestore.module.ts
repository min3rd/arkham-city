import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DynamicSchema, DynamicSchemaSchema } from './firestore.type';
import { FirestoreService } from './firestore.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { MongooseService } from '../mongoose/mongoose.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature(
      [{ name: DynamicSchema.name, schema: DynamicSchemaSchema }],
      'firestore',
    ),
    ClientsModule.register([
      {
        name: microserviceConfig.firestore.name,
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
