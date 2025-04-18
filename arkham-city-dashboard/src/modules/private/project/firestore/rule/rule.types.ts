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

export interface RuleConditionResDto {
  condition: RuleConditionType;
  customCondition: string;
}

export interface RuleResDto {
  _id: string;
  schema?: string;
  type?: RuleType;
  conditions?: RuleConditionResDto[];
}

export interface CreateRuleReqDto {
  schema?: string;
  type?: RuleType;
  conditions?: RuleConditionResDto[];
}

export interface UpdateRuleReqDto {
  schema?: string;
  type?: RuleType;
  conditions?: RuleConditionResDto[];
}
