import { Module } from '@nestjs/common';
import { HashService } from './hash/hash.service';
import { BaseService } from './base/base.service';
import { MongooseService } from './mongoose/mongoose.service';

@Module({
  imports: [],
  providers: [HashService, BaseService, MongooseService],
  controllers: [],
})
export class CoreModule {}
