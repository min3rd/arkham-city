import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Migration {
  @Prop({
    required: true,
    unique: true,
  })
  key: string;
}

export type MigrationDocument = HydratedDocument<Migration>;

export const MigrationSchema = SchemaFactory.createForClass(Migration);
