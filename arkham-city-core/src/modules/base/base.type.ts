import { Prop, Schema } from '@nestjs/mongoose';

export interface ResponseDto {
  timestamp?: Date;
  error?: boolean;
  errorCode?: any;
  data?: any;
}

@Schema({
  timestamps: true,
})
export class AuditEntity {
  _id?: string;

  @Prop()
  createdBy?: string;

  @Prop({
    default: new Date(),
  })
  createdAt?: Date;

  @Prop()
  updatedBy?: string;

  @Prop({
    default: new Date(),
  })
  updatedAt?: Date;

  @Prop({
    default: true,
    select: false,
  })
  activated?: boolean = true;
}
