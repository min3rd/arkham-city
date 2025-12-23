import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AuditEntity } from '../base/base.type';

@Schema({
  timestamps: true,
})
export class Role extends AuditEntity {
  @Prop({
    unique: true,
    required: true,
  })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    type: [String],
    default: [],
  })
  permissions: string[];

  @Prop({
    default: false,
  })
  default?: boolean;
}

export type RoleDocument = HydratedDocument<Role>;

export const RoleSchema = SchemaFactory.createForClass(Role);
