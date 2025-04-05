import { Module } from '@nestjs/common';
import { MicroserviceWebsdkAuthModule } from './microservice-websdk-auth/microservice-websdk-auth.module';

@Module({
  imports: [MicroserviceWebsdkAuthModule],
})
export class MicroserviceWebsdkModule {}
