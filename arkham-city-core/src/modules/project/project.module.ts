import { Module } from '@nestjs/common';
import { AppModule } from './app/app.module';
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
    AppModule,
  ],
  providers: [ProjectService],
  exports: [ProjectService, AppModule],
})
export class ProjectModule {}
