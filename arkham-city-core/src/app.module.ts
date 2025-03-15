import { Module } from '@nestjs/common';
import { FirestoreModule } from './modules/firestore/firestore.module';
import { StorageModule } from './modules/storage/storage.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_METADATA as string, {
      connectionName: databaseConfig.MONGO_DB_METADATA,
    }),
    FirestoreModule,
    StorageModule,
    CoreModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
