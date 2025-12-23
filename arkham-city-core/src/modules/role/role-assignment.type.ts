import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AuditEntity } from '../base/base.type';
import { User } from '../user/user.type';
import { Role } from './role.type';

export type RoleAssignmentScope = 'global' | 'project' | 'resource';

@Schema({
  timestamps: true,
})
export class RoleAssignment extends AuditEntity {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId | User;

  @Prop({
    type: Types.ObjectId,
    ref: Role.name,
    required: true,
  })
  role: Types.ObjectId | Role;

  @Prop({
    required: true,
    enum: ['global', 'project', 'resource'],
  })
  scope: RoleAssignmentScope;

  @Prop()
  projectId?: string;

  @Prop()
  resourceId?: string;
}

export type RoleAssignmentDocument = HydratedDocument<RoleAssignment>;

export const RoleAssignmentSchema =
  SchemaFactory.createForClass(RoleAssignment);
RoleAssignmentSchema.index(
  { user: 1, role: 1, scope: 1, projectId: 1, resourceId: 1 },
  { unique: true, name: 'unique_role_assignment' },
);
