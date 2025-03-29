import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AuditEntity } from '../base/base.type';

@Schema()
export class Project extends AuditEntity {
  @Prop()
  name: string;

  @Prop()
  description?: string;
}

export type ProjectDocument = HydratedDocument<Project>;

export const projectSchema = SchemaFactory.createForClass(Project);
