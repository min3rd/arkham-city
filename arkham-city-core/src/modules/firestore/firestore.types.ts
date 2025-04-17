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

@Schema({
  timestamps: true,
})
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

export enum RuleType {
  read = 'read',
  create = 'create',
  update = 'update',
  delete = 'delete',
}

@Schema({
  timestamps: true,
})
export class Rule extends AuditEntity {
  @Prop()
  pattern: string;

  @Prop({
    enum: RuleType,
  })
  type: RuleType;

  @Prop()
  condition: string;
}
