import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '../role/role.type';
import {
  RoleAssignment,
  RoleAssignmentSchema,
} from '../role/role-assignment.type';
import { User, UserSchema } from '../user/user.type';
import { Migration, MigrationSchema } from './migrations.type';
import { MigrationsService } from './migrations.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Migration.name, schema: MigrationSchema },
        { name: Role.name, schema: RoleSchema },
        { name: RoleAssignment.name, schema: RoleAssignmentSchema },
        { name: User.name, schema: UserSchema },
      ],
      'metadata',
    ),
  ],
  providers: [MigrationsService],
})
export class MigrationsModule {}
