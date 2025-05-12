import { Module } from '@nestjs/common';
import { ProjectAppModule } from './app/project-app.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './project.types';
import { ProjectFirestoreModule } from './project-firestore/project-firestore.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature(
      [{ name: Project.name, schema: ProjectSchema }],
      'metadata',
    ),
    ProjectAppModule,
    ProjectFirestoreModule,
  ],
  providers: [ProjectService],
  exports: [ProjectService, ProjectAppModule, ProjectFirestoreModule],
})
export class ProjectModule {}
