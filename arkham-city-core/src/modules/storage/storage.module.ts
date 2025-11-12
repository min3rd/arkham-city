import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageService } from './storage.service';
import { DatabaseModule } from '@modules/database/database.module';
import { Project, ProjectSchema } from '@modules/project/project.types';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    MongooseModule.forFeature(
      [{ name: Project.name, schema: ProjectSchema }],
      'metadata',
    ),
  ],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
