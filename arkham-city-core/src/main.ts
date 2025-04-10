import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsoleLogger, VersioningType } from '@nestjs/common';
import { HttpInterceptor } from './core/interceptors/http/http.interceptor';

async function bootstrap() {
  if (process.env.MICROSERVICE_ONLY === 'true') {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        logger: new ConsoleLogger({
          prefix: process.env.APP_NAME + '-microservices-only',
        }),
        transport: Transport.REDIS,
        options: {
          host: (process.env.REDIS_HOST as string) || 'localhost',
          port: parseInt(process.env.REDIS_PORT as string) || 6379,
          retryAttempts: 5,
          retryDelay: 3000,
        },
      },
    );
    await app.listen();
  } else {
    const app = await NestFactory.create(AppModule, {
      logger: new ConsoleLogger({
        prefix: process.env.APP_NAME,
      }),
    });

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

    app.enableCors({
      origin: '*',
    });

    app.useGlobalInterceptors(new HttpInterceptor());

    await app.listen(process.env.PORT || 3000);
  }
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
