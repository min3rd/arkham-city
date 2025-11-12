import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';
import { DatabaseModule } from '@modules/database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
