import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AuditEntity } from '../base/base.type';

@Schema({
  timestamps: true,
})
export class User extends AuditEntity {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop({})
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
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
