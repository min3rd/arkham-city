import { Module } from '@nestjs/common';
import { WebSDKAuthService } from './websdk-auth.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseService } from 'src/modules/mongoose/mongoose.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from 'src/modules/project/project.types';
import {
  ProjectApp,
  AppSchema as ProjectAppSchema,
} from 'src/modules/project/app/project-app.type';
import { JwtModule } from '@nestjs/jwt';
import { HashService } from 'src/core/hash/hash.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature(
      [
        { name: Project.name, schema: ProjectSchema },
        { name: ProjectApp.name, schema: ProjectAppSchema },
      ],
      'metadata',
    ),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
      },
    }),
  ],
  providers: [WebSDKAuthService, MongooseService, HashService],
  exports: [WebSDKAuthService],
})
export class WebSDKAuthModule {}
