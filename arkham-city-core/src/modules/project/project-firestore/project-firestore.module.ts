import { Module } from '@nestjs/common';
import { ProjectFirestoreService } from './project-firestore.service';
import { DatabaseService } from '../../database/database.service';
import { ConfigModule } from '@nestjs/config';
import { FirestoreModule } from '../../firestore/firestore.module';

@Module({
  imports: [ConfigModule.forRoot(), FirestoreModule],
  controllers: [],
  providers: [DatabaseService, ProjectFirestoreService],
})
export class ProjectFirestoreModule {}
