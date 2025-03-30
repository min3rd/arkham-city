import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from '../project.type';

export enum APP_TYPE {
  WEB_APP = 'WEB_APP',
}

@Schema()
export class App {
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
}

export type AppDocument = HydratedDocument<App>;

export const AppSchema = SchemaFactory.createForClass(App);
