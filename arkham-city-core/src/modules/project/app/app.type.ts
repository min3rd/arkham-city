import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from '../project.type';
import { AuditEntity } from 'src/modules/base/base.type';
import { User } from 'src/modules/user/user.type';

export enum APP_TYPE {
  WEB_APP = 'WEB_APP',
}

@Schema()
export class App extends AuditEntity {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({
    enum: APP_TYPE,
  })
  type: APP_TYPE;

  @Prop()
  callback: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: Project.name,
  })
  project: Project;

  @Prop({
    unique: true,
  })
  clientId: string;

  @Prop({
    unique: true,
  })
  secretKey: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: User.name,
  })
  user: User;
}

export type AppDocument = HydratedDocument<App>;

export const AppSchema = SchemaFactory.createForClass(App);
