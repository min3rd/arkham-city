import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectApp, AppSchema } from './project-app.type';
import { ProjectAppService } from './project-app.service';
import { HashService } from 'src/core/hash/hash.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature(
      [{ name: ProjectApp.name, schema: AppSchema }],
      'metadata',
    ),
  ],
  providers: [HashService, ProjectAppService],
  exports: [ProjectAppService],
})
export class ProjectAppModule {}
