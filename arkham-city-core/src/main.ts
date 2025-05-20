import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsoleLogger, VersioningType } from '@nestjs/common';
import { HttpInterceptor } from './core/interceptors/http/http.interceptor';
import { ServiceModule } from './service.module';
import * as process from 'node:process';
import {
  getMicroserviceConfigNames,
  microserviceConfig,
} from './config/microservice.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  if (process.env.MICROSERVICE_ONLY === 'true') {
    const app = await NestFactory.create(ServiceModule, {
      logger: new ConsoleLogger({
        prefix: process.env.APP_NAME,
      }),
    });
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
        queue: 'arkham-city',
        queueOptions: {
          durable: false,
        },
      },
    });

    // Connect to all microservice's queues
    for (const name of getMicroserviceConfigNames()) {
      app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: name + '-queue',
          queueOptions: {
            durable: false,
          },
        },
      });
    }

    await app.listen(process.env.PORT || 3000);
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
        queue: 'arkham-city',
        queueOptions: {
          durable: false,
        },
      },
    });

    // Connect to all microservice's queues
    for (const name of getMicroserviceConfigNames()) {
      app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: name + '-queue',
          queueOptions: {
            durable: false,
          },
        },
      });
    }

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
        queue: microserviceConfig.auth.name + '-queue',
        queueOptions: {
          durable: false,
        },
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

    const swaggerConfig = new DocumentBuilder()
      .setTitle(process.env.APP_NAME ?? 'Arkham City')
      .setDescription('Arkham City API')
      .setVersion('1.0')
      .build();

    const documentFactory = () =>
      SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('swagger', app, documentFactory);

    await app.listen(process.env.PORT || 3000);
  }
}

bootstrap().then(() => {
  console.log(
    `${new Date().toUTCString()} ${process.env.APP_NAME} started successfully`,
  );
});
