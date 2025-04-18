import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from '../../../../config/microservice.config';
import {
  MsCreateProjectFirestoreRuleReqPayload,
  MsDeleteProjectFirestoreRuleReqPayload,
  MsGetAllProjectFirestoreRulesReqPayload,
  MsGetProjectFirestoreRuleReqPayload,
  MsUpdateProjectFirestoreRuleReqPayload,
} from './ms-project-firestore-rule.interface';
import { FirestoreRuleService } from '../../../../modules/firestore/firestore-rule/firestore-rule.service';

@Controller()
export class MsProjectFirestoreRuleController {
  constructor(private readonly firestoreRuleService: FirestoreRuleService) {}

  @MessagePattern(microserviceConfig.project.firestore.rule.patterns.createRule)
  createRule(@Payload() payload: MsCreateProjectFirestoreRuleReqPayload) {
    return this.firestoreRuleService.createRawRule(
      payload.user,
      payload.projectId,
      payload.schema,
      payload.type,
      payload.conditions.map((e) => ({
        type: e.type,
        customCondition: e.customCondition,
      })),
    );
  }

  @MessagePattern(microserviceConfig.project.firestore.rule.patterns.updateRule)
  updateRule(@Payload() payload: MsUpdateProjectFirestoreRuleReqPayload) {
    return this.firestoreRuleService.updateRawRule(
      payload.projectId,
      payload.ruleId,
      payload.schema,
      payload.type,
      payload.conditions.map((e) => ({
        type: e.type,
        customCondition: e.customCondition,
      })),
    );
  }

  @MessagePattern(microserviceConfig.project.firestore.rule.patterns.deleteRule)
  deleteRule(@Payload() payload: MsDeleteProjectFirestoreRuleReqPayload) {
    return this.firestoreRuleService.deleteRawRule(
      payload.projectId,
      payload.ruleId,
    );
  }

  @MessagePattern(microserviceConfig.project.firestore.rule.patterns.getRule)
  getRule(@Payload() payload: MsGetProjectFirestoreRuleReqPayload) {
    return this.firestoreRuleService.getRawRule(
      payload.projectId,
      payload.ruleId,
    );
  }

  @MessagePattern(
    microserviceConfig.project.firestore.rule.patterns.getAllRules,
  )
  getAllRules(@Payload() payload: MsGetAllProjectFirestoreRulesReqPayload) {
    return this.firestoreRuleService.getRawRules(payload.projectId);
  }
}
