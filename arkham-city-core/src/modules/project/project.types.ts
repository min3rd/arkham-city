import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { AuditEntity } from '../base/base.type';
import { User } from '../user/user.type';

@Schema({
  timestamps: true,
})
export class Project extends AuditEntity {
  @Prop()
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: User.name })
  user: User;

  @Prop()
  privateKey: string;
}

export type ProjectDocument = HydratedDocument<Project>;

export const ProjectSchema = SchemaFactory.createForClass(Project);
