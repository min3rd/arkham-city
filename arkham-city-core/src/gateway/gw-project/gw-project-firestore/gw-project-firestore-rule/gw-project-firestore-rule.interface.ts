import {
  RuleConditionType,
  RuleType,
} from '../../../../modules/firestore/firestore-rule/firestore-rule.types';

export interface GwProjectFirestoreRuleConditionDto {
  type: RuleConditionType;
  customCondition: string;
}

export interface GwCreateProjectFirestoreRuleReqDto {
  projectId: string;
  schema: string;
  type: RuleType;
  conditions: GwProjectFirestoreRuleConditionDto[];
}

export interface GwUpdateProjectFirestoreRuleReqDto {
  projectId: string;
  ruleId: string;
  schema: string;
  type: RuleType;
  conditions: GwProjectFirestoreRuleConditionDto[];
}

export interface GwDeleteProjectFirestoreRuleReqDto {
  projectId: string;
  ruleId: string;
}
