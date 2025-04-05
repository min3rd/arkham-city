import { Module } from '@nestjs/common';
import { GatewayWebsdkAuthModule } from './gateway-websdk-auth/gateway-websdk-auth.module';

@Module({
  imports: [GatewayWebsdkAuthModule],
})
export class GatewayWebsdkModule {}
