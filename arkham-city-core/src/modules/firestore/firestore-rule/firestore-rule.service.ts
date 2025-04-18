import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  RawRule,
  RawRuleSchema,
  RuleCondition,
  RuleType,
} from './firestore-rule.types';
import { DatabaseService } from '../../database/database.service';
import {
  BadResponse,
  Errors,
  GoodResponse,
} from '../../../core/microservice/microservice.types';
import { microserviceConfig } from '../../../config/microservice.config';
import { ClientRedis } from '@nestjs/microservices';

@Injectable()
export class FirestoreRuleService {
  private readonly logger = new Logger(FirestoreRuleService.name);

  constructor(
    private readonly dataService: DatabaseService,
    @Inject(microserviceConfig.firestore.name)
    private readonly clientProxy: ClientRedis,
  ) {}

  async createRawRule(
    projectId: string,
    schema: string,
    type: RuleType,
    condition: RuleCondition,
    customCondition: string,
  ) {
    this.logger.log(
      'createRawRule:start',
      projectId,
      schema,
      type,
      condition,
      customCondition,
    );
    const connection = this.dataService.createProjectConnection(projectId);
    const _RawRuleModel = connection.model(RawRule.name, RawRuleSchema);
    let rawRule = new _RawRuleModel({
      schema: schema,
      type,
      condition,
      customCondition,
    });
    rawRule = await rawRule.save();
    if (!rawRule) {
      return new BadResponse(Errors.DEFAULT);
    }
    this.logger.log('createRawRule:end', rawRule);
    return new GoodResponse(rawRule.toJSON());
  }

  async updateRawRule(
    projectId: string,
    ruleId: string,
    type: RuleType,
    condition: RuleCondition,
    customCondition: string,
  ) {
    this.logger.log(
      'updateRawRule:start',
      projectId,
      ruleId,
      type,
      condition,
      customCondition,
    );
    const connection = this.dataService.createProjectConnection(projectId);
    const _RawRuleModel = connection.model(RawRule.name, RawRuleSchema);
    const rawRule = await _RawRuleModel.findByIdAndUpdate(
      ruleId,
      {
        type,
        condition,
        customCondition,
      },
      { new: true },
    );
    if (!rawRule) {
      return new BadResponse(Errors.DEFAULT);
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
      return new BadResponse(Errors.DEFAULT);
    }
    this.logger.log('deleteRawRule:end', rawRule);
    return new GoodResponse(rawRule.toJSON());
  }
}
