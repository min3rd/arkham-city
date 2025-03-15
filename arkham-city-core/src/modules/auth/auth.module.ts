import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: microserviceConfig.auth.name,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => {
          return {
            transport: Transport.REDIS,
            options: {
              host: config.get('REDIS_HOST'),
              port: parseInt(config.get('REDIS_PORT') as string),
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
