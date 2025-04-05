import { Module } from '@nestjs/common';
import { ProjectAppModule } from './app/project-app.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './project.type';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature(
      [{ name: Project.name, schema: ProjectSchema }],
      'metadata',
    ),
    ProjectAppModule,
  ],
  providers: [ProjectService],
  exports: [ProjectService, ProjectAppModule],
})
export class ProjectModule {}
