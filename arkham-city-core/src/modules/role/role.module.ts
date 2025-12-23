import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './role.type';
import {
  RoleAssignment,
  RoleAssignmentSchema,
} from './role-assignment.type';
import { RoleService } from './role.service';
import { RoleAssignmentService } from './role-assignment.service';
import { User, UserSchema } from '../user/user.type';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature(
      [
        { name: Role.name, schema: RoleSchema },
        { name: RoleAssignment.name, schema: RoleAssignmentSchema },
        { name: User.name, schema: UserSchema },
      ],
      'metadata',
    ),
  ],
  providers: [RoleService, RoleAssignmentService],
  exports: [RoleService, RoleAssignmentService],
})
export class RoleModule {}
