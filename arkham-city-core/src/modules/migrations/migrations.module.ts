import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '../role/role.type';
import { Migration, MigrationSchema } from './migrations.type';
import { MigrationsService } from './migrations.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Migration.name, schema: MigrationSchema },
        { name: Role.name, schema: RoleSchema },
      ],
      'metadata',
    ),
  ],
  providers: [MigrationsService],
})
export class MigrationsModule {}
