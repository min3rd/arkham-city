import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { AuditEntity } from '../base/base.type';

@Schema()
export class FirestoreSchemaField extends AuditEntity {
  @Prop()
  name: string;

  @Prop()
  type: string;
}

@Schema({})
export class FirestoreDynamicSchema extends AuditEntity {
  @Prop()
  name: string;

  @Prop({
    type: mongoose.Types.ArraySubdocument,
  })
  fields: FirestoreSchemaField[];
}

export type FirestoreDynamicSchemaDocument =
  HydratedDocument<FirestoreDynamicSchema>;

export const FirestoreDynamicSchemaSchema = SchemaFactory.createForClass(
  FirestoreDynamicSchema,
);
