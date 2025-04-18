import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuditEntity } from '../../base/base.type';
import { SchemaTypes } from 'mongoose';

export enum RuleType {
  read = 'read',
  create = 'create',
  update = 'update',
  delete = 'delete',
}

export enum RuleCondition {
  require_auth = 'require_auth',
  owner = 'owner',
  allow = 'allow',
  deny = 'deny',
  custom = 'custom',
}

@Schema({
  timestamps: true,
})
export class RawRule extends AuditEntity {
  @Prop()
  schema: string;

  @Prop({
    enum: RuleType,
  })
  type: RuleType;

  @Prop({
    enum: RuleCondition,
    type: SchemaTypes.Array,
  })
  condition: RuleCondition[] = [RuleCondition.deny];

  @Prop()
  customCondition: string;
}

export const RawRuleSchema = SchemaFactory.createForClass(RawRule);
