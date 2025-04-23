import {
  RuleConditionType,
  RuleType,
} from '../../../../modules/firestore/firestore-rule/firestore-rule.types';
import { JWTPayload } from '../../../../modules/auth/auth.interface';

export interface MsProjectFirestoreRuleCondition {
  condition: RuleConditionType;
  customCondition?: string;
}

export interface MsProjectFirestoreRule {
  type: RuleType;
  conditions: MsProjectFirestoreRuleCondition[];
}

export interface MsCreateProjectFirestoreRuleReqPayload {
  user: JWTPayload;
  projectId: string;
  schema: string;
  rules: MsProjectFirestoreRule[];
}

export interface MsUpdateProjectFirestoreRuleReqPayload {
  user: JWTPayload;
  projectId: string;
  schema: string;
  rules: MsProjectFirestoreRule[];
}

export interface MsDeleteProjectFirestoreRuleReqPayload {
  user: JWTPayload;
  projectId: string;
  ruleId: string;
}

export interface MsGetProjectFirestoreRuleReqPayload {
  user: JWTPayload;
  projectId: string;
  schema: string;
}

export interface MsGetAllProjectFirestoreRulesReqPayload {
  user: JWTPayload;
  projectId: string;
}
