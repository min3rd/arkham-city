import { Module } from '@nestjs/common';
import { MongooseModule } from './mongoose/mongoose.module';
import { HashService } from './hash/hash.service';

@Module({
  imports: [MongooseModule],
  providers: [HashService],
})
export class CoreModule {}
