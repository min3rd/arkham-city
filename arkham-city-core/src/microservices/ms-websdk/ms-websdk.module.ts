import { Module } from '@nestjs/common';
import { MsWebsdkAuthModule } from './ms-websdk-auth/ms-websdk-auth.module';

@Module({
  imports: [MsWebsdkAuthModule],
})
export class MsWebsdkModule {}
