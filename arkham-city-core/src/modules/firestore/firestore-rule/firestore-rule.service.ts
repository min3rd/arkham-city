import { Injectable, Logger } from '@nestjs/common';
import { RawRule, RawRuleSchema } from './firestore-rule.types';
import { DatabaseService } from '../../database/database.service';
import {
  BadResponse,
  Errors,
  GoodResponse,
} from '../../../core/microservice/microservice.types';
import { JWTPayload } from '../../auth/auth.interface';
import { MsProjectFirestoreRule } from '../../../microservices/ms-project/ms-project-firestore/ms-project-firestore-rule/ms-project-firestore-rule.interface';

@Injectable()
export class FirestoreRuleService {
  private readonly logger = new Logger(FirestoreRuleService.name);

  constructor(private readonly dataService: DatabaseService) {}

  async createRawRule(
    user: JWTPayload,
    projectId: string,
    schema: string,
    rules: MsProjectFirestoreRule[],
  ) {
    this.logger.log('createRawRule:start', user, projectId, schema, rules);
    const connection = this.dataService.createProjectConnection(projectId);
    const _RawRuleModel = connection.model(RawRule.name, RawRuleSchema);
    const results: any[] = [];
    for (const rule of rules) {
      if (!rule.conditions || rule.conditions.length === 0) {
        continue;
      }
      if (await _RawRuleModel.exists({ schema: schema, type: rule.type })) {
        return new BadResponse(Errors.PROJECT_FIRESTORE_RULE_ALREADY_EXISTS);
      }
      let rawRule = new _RawRuleModel({
        schema: schema,
        type: rule.type,
        conditions: rule.conditions,
      });
      rawRule = await rawRule.save();
      if (!rawRule) {
        return new BadResponse(
          Errors.PROJECT_FIRESTORE_RULE_COULD_NOT_CREATE_NEW_RULE,
        );
      }
      results.push(rawRule.toJSON());
    }
    this.logger.log('createRawRule:end', results);
    return new GoodResponse(this.combineRule(results));
  }

  async updateRawRule(
    user: JWTPayload,
    projectId: string,
    schema: string,
    rules: MsProjectFirestoreRule[],
  ) {
    this.logger.log('updateRawRule:start', user, projectId, schema, rules);
    const connection = this.dataService.createProjectConnection(projectId);
    const _RawRuleModel = connection.model(RawRule.name, RawRuleSchema);
    const rawRules: RawRule[] = [];
    for (const rule of rules) {
      if (rule.conditions.length === 0) {
        continue;
      }
      let rawRule = await _RawRuleModel.findOne({
        schema: schema,
        type: rule.type,
      });
      if (!rawRule) {
        rawRule = new _RawRuleModel({
          schema: schema,
          type: rule.type,
        });
      }
      rawRule.conditions = rule.conditions.map(
        (condition: { condition: any; customCondition: any }) => ({
          condition: condition.condition,
          customCondition: condition.customCondition,
        }),
      );
      rawRule = await rawRule.save();
      rawRules.push(rawRule);
    }
    this.logger.log('updateRawRule:end', rules);
    return new GoodResponse(this.combineRule(rawRules));
  }

  async deleteRawRule(projectId: string, schema: string) {
    this.logger.log('deleteRawRule:start', projectId, schema);
    const connection = this.dataService.createProjectConnection(projectId);
    const _RawRuleModel = connection.model(RawRule.name, RawRuleSchema);
    await _RawRuleModel.deleteMany({ schema: schema });
    this.logger.log('deleteRawRule:end');
    return new GoodResponse(true);
  }

  async getRawRule(projectId: string, schema: string) {
    this.logger.log('getRawRule:start', projectId, schema);
    const connection = this.dataService.createProjectConnection(projectId);
    const _RawRuleModel = connection.model(RawRule.name, RawRuleSchema);
    const rawRules = await _RawRuleModel.find({ schema: schema });
    if (!rawRules) {
      return new BadResponse(Errors.PROJECT_FIRESTORE_RULE_COULD_NOT_FOUND);
    }
    this.logger.log('getRawRule:end', rawRules);
    return new GoodResponse({
      schema: rawRules[0].schema,
      rules: rawRules.map((rule) => ({
        _id: rule._id,
        type: rule.type,
        conditions: rule.conditions,
      })),
    });
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
    return new GoodResponse(this.combineRules(rawRules));
  }

  private combineRules(rawRules: RawRule[]) {
    return rawRules.reduce((acc: any[], cur) => {
      const index = acc.findIndex((e) => e.schema === cur.schema);
      if (index === -1) {
        acc.push({
          schema: cur.schema,
          rules: [
            {
              _id: cur._id,
              type: cur.type,
              conditions: cur.conditions,
            },
          ],
        });
      } else {
        acc[index].rules.push({
          _id: cur._id,
          type: cur.type,
          conditions: cur.conditions,
        });
      }
      return acc;
    }, []);
  }

  private combineRule(rawRules: RawRule[]) {
    return {
      schema: rawRules[0].schema,
      rules: rawRules.map((rule) => ({
        _id: rule._id,
        type: rule.type,
        conditions: rule.conditions,
      })),
    };
  }
}
