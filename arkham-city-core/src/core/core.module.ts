import { Module } from '@nestjs/common';
import { MongooseModule } from './mongoose/mongoose.module';
import { HashService } from './hash/hash.service';
import { BaseService } from './base/base.service';

@Module({
  imports: [MongooseModule],
  providers: [HashService, BaseService],
  controllers: [],
})
export class CoreModule {}
