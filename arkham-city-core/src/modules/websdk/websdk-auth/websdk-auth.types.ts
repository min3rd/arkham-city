import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AuditEntity } from 'src/modules/base/base.type';

@Schema({
  timestamps: true,
})
export class WebSDKUser extends AuditEntity {
  @Prop({
    unique: true,
  })
  username: string;

  @Prop({
    unique: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  middleName: string;

  @Prop()
  displayName: string;
}

export type WebSDKUserDocument = HydratedDocument<WebSDKUser>;
export const WebSDKUserSchema = SchemaFactory.createForClass(WebSDKUser);
