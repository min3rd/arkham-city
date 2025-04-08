import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class FirestoreSchemaField {
  @Prop()
  name: string;

  @Prop()
  type: string;
}

@Schema()
export class FirestoreDynamicSchema {
  @Prop()
  name: string;

  @Prop({
    type: [mongoose.Types.ObjectId],
  })
  fields?: FirestoreSchemaField[];
}

export type FirestoreDynamicSchemaDocument =
  HydratedDocument<FirestoreDynamicSchema>;

export const FirestoreDynamicSchemaSchema = SchemaFactory.createForClass(
  FirestoreDynamicSchema,
);

export type FirestoreSchemaFieldDocument =
  HydratedDocument<FirestoreSchemaField>;

export const FirestoreSchemaFieldSchema =
  SchemaFactory.createForClass(FirestoreSchemaField);
