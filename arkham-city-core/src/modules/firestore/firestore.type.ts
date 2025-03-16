import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class Field {
  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop({
    default: false,
  })
  required?: boolean = false;

  @Prop()
  defaultValue?: string;
}

@Schema()
export class DynamicSchema {
  @Prop()
  name: string;

  @Prop({
    type: [mongoose.Types.ObjectId],
  })
  fields?: Field[];
}

export type DynamicSchemaDocument = HydratedDocument<DynamicSchema>;

export const DynamicSchemaSchema = SchemaFactory.createForClass(DynamicSchema);
