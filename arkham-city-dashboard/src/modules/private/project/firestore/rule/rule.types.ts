export interface RuleConditionResDto {
  condition: string;
  customCondition: string;
}

export interface RuleConditionReqDto {
  condition?: string;
  customCondition?: string;
}

export interface RuleReqDto {
  type?: string;
  conditions?: RuleConditionReqDto[];
}

export interface RuleResDto {
  type?: string;
  conditions?: RuleConditionResDto[];
}

export interface SchemaRuleResDto {
  _id: string;
  schema?: string;
  rules?: RuleResDto[];
}

export interface CreateRuleReqDto {
  schema?: string;
  rules?: RuleReqDto[];
}

export interface UpdateRuleReqDto {
  schema?: string;
  type?: string;
  conditions?: RuleConditionResDto[];
}
