import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MicroservicesModule } from './microservices/microservices.module';
import { GatewayModule } from './gateway/gateway.module';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_METADATA as string, {
      connectionName: 'metadata',
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_FIRESTORE as string, {
      connectionName: 'firestore',
    }),
    CoreModule,
    MicroservicesModule,
    GatewayModule,
    ModulesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
