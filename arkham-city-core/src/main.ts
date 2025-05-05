import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsoleLogger, VersioningType } from '@nestjs/common';
import { HttpInterceptor } from './core/interceptors/http/http.interceptor';
import { ServiceModule } from './service.module';
import * as process from 'node:process';

async function bootstrap() {
  if (process.env.MICROSERVICE_ONLY === 'true') {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      ServiceModule,
      {
        logger: new ConsoleLogger({
          prefix: process.env.APP_NAME,
        }),
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
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
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
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

bootstrap().then(() => {
  console.log(
    `${new Date().toUTCString()} ${process.env.APP_NAME} started successfully`,
  );
});
