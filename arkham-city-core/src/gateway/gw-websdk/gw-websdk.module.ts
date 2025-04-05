import { Module } from '@nestjs/common';
import { GwWebsdkAuthModule } from './gw-websdk-auth/gw-websdk-auth.module';

@Module({
  imports: [GwWebsdkAuthModule],
})
export class GwWebsdkModule {}
