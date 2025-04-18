import { Injectable, Logger } from '@nestjs/common';
import {
  RawRule,
  RawRuleSchema,
  RuleConditionType,
  RuleType,
} from './firestore-rule.types';
import { DatabaseService } from '../../database/database.service';
import {
  BadResponse,
  Errors,
  GoodResponse,
} from '../../../core/microservice/microservice.types';
import { JWTPayload } from '../../auth/auth.interface';

@Injectable()
export class FirestoreRuleService {
  private readonly logger = new Logger(FirestoreRuleService.name);

  constructor(private readonly dataService: DatabaseService) {}

  async createRawRule(
    user: JWTPayload,
    projectId: string,
    schema: string,
    type: RuleType,
    conditions: {
      type: RuleConditionType;
      customCondition?: string;
    }[],
  ) {
    this.logger.log('createRawRule:start', projectId, schema, type, conditions);
    const connection = this.dataService.createProjectConnection(projectId);
    const _RawRuleModel = connection.model(RawRule.name, RawRuleSchema);
    if (
      await _RawRuleModel.exists({
        schema: schema,
      })
    ) {
      return new BadResponse(Errors.PROJECT_FIRESTORE_RULE_ALREADY_EXISTS);
    }
    let rawRule = new _RawRuleModel({
      schema: schema,
      type: type,
      conditions: conditions,
      user: {
        _id: user.sub,
      },
    });
    rawRule = await rawRule.save();
    if (!rawRule) {
      return new BadResponse(
        Errors.PROJECT_FIRESTORE_RULE_COULD_NOT_CREATE_NEW_RULE,
      );
    }
    this.logger.log('createRawRule:end', rawRule);
    return new GoodResponse(rawRule.toJSON());
  }

  async updateRawRule(
    projectId: string,
    ruleId: string,
    schema: string,
    type: RuleType,
    conditions: {
      type: RuleConditionType;
      customCondition?: string;
    }[],
  ) {
    this.logger.log(
      'updateRawRule:start',
      projectId,
      ruleId,
      schema,
      type,
      conditions,
    );
    const connection = this.dataService.createProjectConnection(projectId);
    const _RawRuleModel = connection.model(RawRule.name, RawRuleSchema);
    const rawRule = await _RawRuleModel.findByIdAndUpdate(
      ruleId,
      {
        schema: schema,
        type: type,
        conditions: conditions,
      },
      { new: true },
    );
    if (!rawRule) {
      return new BadResponse(Errors.PROJECT_FIRESTORE_RULE_COULD_NOT_FOUND);
    }
    this.logger.log('updateRawRule:end', rawRule);
    return new GoodResponse(rawRule.toJSON());
  }

  async deleteRawRule(projectId: string, ruleId: string) {
    this.logger.log('deleteRawRule:start', projectId, ruleId);
    const connection = this.dataService.createProjectConnection(projectId);
    const _RawRuleModel = connection.model(RawRule.name, RawRuleSchema);
    const rawRule = await _RawRuleModel.findByIdAndDelete(ruleId);
    if (!rawRule) {
      return new BadResponse(Errors.PROJECT_FIRESTORE_RULE_COULD_NOT_FOUND);
    }
    this.logger.log('deleteRawRule:end', rawRule);
    return new GoodResponse(rawRule.toJSON());
  }

  async getRawRule(projectId: string, ruleId: string) {
    this.logger.log('getRawRule:start', projectId, ruleId);
    const connection = this.dataService.createProjectConnection(projectId);
    const _RawRuleModel = connection.model(RawRule.name, RawRuleSchema);
    const rawRule = await _RawRuleModel.findById(ruleId);
    if (!rawRule) {
      return new BadResponse(Errors.PROJECT_FIRESTORE_RULE_COULD_NOT_FOUND);
    }
    this.logger.log('getRawRule:end', rawRule);
    return new GoodResponse(rawRule.toJSON());
  }

  async getRawRules(projectId: string) {
    this.logger.log('getRawRules:start', projectId);
    const connection = this.dataService.createProjectConnection(projectId);
    const _RawRuleModel = connection.model(RawRule.name, RawRuleSchema);
    const rawRules = await _RawRuleModel.find();
    if (!rawRules) {
      return new BadResponse(Errors.PROJECT_FIRESTORE_RULE_COULD_NOT_FOUND);
    }
    this.logger.log('getRawRules:end', rawRules);
    return new GoodResponse(rawRules.map((e) => e.toJSON()));
  }
}
