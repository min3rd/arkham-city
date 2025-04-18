import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuditEntity } from '../../base/base.type';

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
export class Rule extends AuditEntity {
  @Prop()
  schema: string;

  @Prop({
    enum: RuleType,
  })
  type: RuleType;

  @Prop({
    enum: RuleCondition,
  })
  condition: RuleCondition = RuleCondition.deny;

  @Prop()
  customCondition: string;
}

@Schema({
  timestamps: true,
})
export class RawRule extends AuditEntity {
  @Prop()
  pattern: string;

  @Prop({
    enum: RuleType,
  })
  type: RuleType;

  @Prop()
  condition: string;
}

export const RawRuleSchema = SchemaFactory.createForClass(RawRule);
export const RuleSchema = SchemaFactory.createForClass(Rule);
