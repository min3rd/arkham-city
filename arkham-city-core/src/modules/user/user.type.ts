import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AuditEntity } from '../base/base.type';
import { Role } from '../role/role.type';

@Schema({
  timestamps: true,
})
export class User extends AuditEntity {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  middleName: string;

  @Prop()
  refreshToken: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Role.name }],
    default: [],
  })
  roles: (Role | string)[];

  @Prop({
    type: [String],
    default: [],
  })
  permissions: string[];

  @Prop({ default: false })
  superAdmin: boolean;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index(
  { superAdmin: 1 },
  {
    unique: true,
    partialFilterExpression: { superAdmin: true },
    name: 'unique_super_admin',
  },
);
