import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuditEntity } from '../../base/base.type';
import { SchemaTypes } from 'mongoose';
import { User } from '../../user/user.type';

export enum RuleType {
  read = 'read',
  create = 'create',
  update = 'update',
  delete = 'delete',
}

export enum RuleConditionType {
  require_auth = 'require_auth',
  owner = 'owner',
  allow = 'allow',
  deny = 'deny',
  custom = 'custom',
}

@Schema()
export class RuleCondition extends AuditEntity {
  @Prop({
    enum: RuleConditionType,
  })
  condition: RuleConditionType;

  @Prop()
  customCondition?: string;
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
    type: SchemaTypes.Array,
  })
  conditions: RuleCondition[];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
  })
  user: User;
}

export const RawRuleSchema = SchemaFactory.createForClass(RawRule);
