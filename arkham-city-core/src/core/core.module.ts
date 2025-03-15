import { Module } from '@nestjs/common';
import { MongooseModule } from './mongoose/mongoose.module';

@Module({
  imports: [MongooseModule],
})
export class CoreModule {}
