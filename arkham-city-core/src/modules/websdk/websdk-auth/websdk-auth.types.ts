import { Prop, Schema } from '@nestjs/mongoose';
import { AuditEntity } from 'src/modules/base/base.type';

@Schema()
export class WebSDKUser extends AuditEntity {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  verified: boolean;
}
