import { Prop, Schema } from '@nestjs/mongoose';

export interface ResponseDto {
  timestamp?: Date;
  error?: boolean;
  errorCode?: any;
  data?: any;
}

@Schema()
export class AuditEntity {
  @Prop()
  createdBy: string;

  @Prop()
  createdAt: Date;

  @Prop()
  lastModifiedBy: string;

  @Prop()
  lastModifiedAt: Date;

  @Prop({
    default: true,
    select: false,
  })
  activated: boolean = true;
}
