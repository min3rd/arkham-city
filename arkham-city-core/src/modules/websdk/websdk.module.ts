import { Module } from '@nestjs/common';
import { WebSDKAuthModule } from './websdk-auth/websdk-auth.module';

@Module({
  imports: [WebSDKAuthModule],
  exports: [WebSDKAuthModule],
})
export class WebsdkModule {}
