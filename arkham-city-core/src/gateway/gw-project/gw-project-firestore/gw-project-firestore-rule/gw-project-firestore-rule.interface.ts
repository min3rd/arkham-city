import {
  RuleConditionType,
  RuleType,
} from '../../../../modules/firestore/firestore-rule/firestore-rule.types';

export interface GwProjectFirestoreRuleConditionDto {
  condition: RuleConditionType;
  customCondition: string;
}

export interface GwProjectFirestoreRuleDto {
  type: RuleType;
  conditions: GwProjectFirestoreRuleConditionDto[];
}

export interface GwCreateProjectFirestoreRuleReqDto {
  projectId: string;
  schema: string;
  rules: GwProjectFirestoreRuleDto[];
}

export interface GwUpdateProjectFirestoreRuleReqDto {
  projectId: string;
  ruleId: string;
  schema: string;
  rules: GwProjectFirestoreRuleDto[];
}
