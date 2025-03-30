import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { AuthService } from './auth/auth.service';
import { User, UserSchema } from './user/user.type';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user/user.service';
import { HashService } from 'src/core/hash/hash.service';
import { MongooseService } from './mongoose/mongoose.service';
import { FirestoreService } from './firestore/firestore.service';
import { DynamicSchema, DynamicSchemaSchema } from './firestore/firestore.type';
import { ProjectService } from './project/project.service';
import { Project, ProjectSchema } from './project/project.type';
import { AppService } from './project/app/app.service';
import { App, AppSchema } from './project/app/app.type';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
      },
    }),
    ClientsModule.register([
      {
        name: microserviceConfig.auth.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
      {
        name: microserviceConfig.firestore.name,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST as string,
          port: parseInt(process.env.REDIS_PORT as string),
        },
      },
    ]),
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Project.name, schema: ProjectSchema },
        { name: App.name, schema: AppSchema },
      ],
      'metadata',
    ),
    MongooseModule.forFeature(
      [{ name: DynamicSchema.name, schema: DynamicSchemaSchema }],
      'firestore',
    ),
  ],
  providers: [
    AuthService,
    UserService,
    HashService,
    MongooseService,
    FirestoreService,
    ProjectService,
    AppService,
  ],
  exports: [AuthService, UserService, FirestoreService, ProjectService],
})
export class ModulesModule {}
