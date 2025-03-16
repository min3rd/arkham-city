import { Module } from '@nestjs/common';
import { HashService } from './hash/hash.service';
import { BaseService } from './base/base.service';

@Module({
  imports: [],
  providers: [HashService, BaseService],
  controllers: [],
})
export class CoreModule {}
