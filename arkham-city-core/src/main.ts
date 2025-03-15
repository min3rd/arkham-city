import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: (process.env.REDIS_HOST as string) || 'localhost',
      port: parseInt(process.env.REDIS_PORT as string) || 6379,
    },
  });
  await app.startAllMicroservices();
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });
  await app.listen(process.env.PORT || 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
