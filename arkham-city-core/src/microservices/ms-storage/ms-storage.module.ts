import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MsStorageController } from './ms-storage.controller';
import { StorageModule } from '@modules/storage/storage.module';

@Module({
  imports: [ConfigModule.forRoot(), StorageModule],
  controllers: [MsStorageController],
})
export class MsStorageModule {}
