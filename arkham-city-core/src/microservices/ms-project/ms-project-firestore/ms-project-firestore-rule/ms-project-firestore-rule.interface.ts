import {
  RuleConditionType,
  RuleType,
} from '../../../../modules/firestore/firestore-rule/firestore-rule.types';
import { JWTPayload } from '../../../../modules/auth/auth.interface';

export interface MsProjectFirestoreRuleCondition {
  type: RuleConditionType;
  customCondition?: string;
}

export interface MsCreateProjectFirestoreRule {
  type: RuleType;
  conditions: MsProjectFirestoreRuleCondition[];
}

export interface MsCreateProjectFirestoreRuleReqPayload {
  user: JWTPayload;
  projectId: string;
  schema: string;
  rules: MsCreateProjectFirestoreRule[];
}

export interface MsUpdateProjectFirestoreRuleReqPayload {
  user: JWTPayload;
  projectId: string;
  ruleId: string;
  schema: string;
  rules: MsCreateProjectFirestoreRule[];
}

export interface MsDeleteProjectFirestoreRuleReqPayload {
  user: JWTPayload;
  projectId: string;
  ruleId: string;
}

export interface MsGetProjectFirestoreRuleReqPayload {
  user: JWTPayload;
  projectId: string;
  ruleId: string;
}

export interface MsGetAllProjectFirestoreRulesReqPayload {
  user: JWTPayload;
  projectId: string;
}
