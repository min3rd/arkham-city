import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { microserviceConfig } from '../../../../config/microservice.config';
import { ClientRedis } from '@nestjs/microservices';
import { GatewayController } from '../../../../core/gateway/gateway.controller';
import { Request } from 'express';
import { GwCreateProjectFirestoreRuleReqDto } from './gw-project-firestore-rule.interface';
import {
  MsCreateProjectFirestoreRuleReqPayload,
  MsDeleteProjectFirestoreRuleReqPayload,
  MsGetAllProjectFirestoreRulesReqPayload,
  MsGetProjectFirestoreRuleReqPayload,
  MsUpdateProjectFirestoreRuleReqPayload,
} from '../../../../microservices/ms-project/ms-project-firestore/ms-project-firestore-rule/ms-project-firestore-rule.interface';
import { firstValueFrom } from 'rxjs';
import { ServiceResponse } from '../../../../core/microservice/microservice.types';
import { REQUEST_FIELDS } from '../../../../config/request.config';

@Controller('projects/:projectId/firestore/rules')
export class GwProjectFirestoreRuleController extends GatewayController {
  constructor(
    @Inject(microserviceConfig.project.firestore.rule.name)
    private readonly clientProxy: ClientRedis,
  ) {
    super();
  }

  @Post('')
  async createFirestoreRule(
    @Req() request: Request,
    @Param() params: any,
    @Body() data: GwCreateProjectFirestoreRuleReqDto,
  ) {
    const payload: MsCreateProjectFirestoreRuleReqPayload = {
      user: request[REQUEST_FIELDS.user],
      projectId: params.projectId,
      schema: data.schema,
      type: data.type,
      conditions: data.conditions,
    };
    const response: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.project.firestore.rule.patterns.createRule,
        payload,
      ),
    );
    this.afterCallMicroservice(response);
    return response.data;
  }

  @Put(':ruleId')
  async updateFirestoreRule(
    @Req() request: Request,
    @Param() params: any,
    @Body() data: GwCreateProjectFirestoreRuleReqDto,
  ) {
    const payload: MsUpdateProjectFirestoreRuleReqPayload = {
      user: request[REQUEST_FIELDS.user],
      projectId: params.projectId,
      ruleId: params.ruleId,
      schema: data.schema,
      type: data.type,
      conditions: data.conditions,
    };
    const response: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.project.firestore.rule.patterns.updateRule,
        payload,
      ),
    );
    this.afterCallMicroservice(response);
    return response.data;
  }

  @Delete(':ruleId')
  async deleteFirestoreRule(@Req() request: Request, @Param() params: any) {
    const payload: MsDeleteProjectFirestoreRuleReqPayload = {
      user: request[REQUEST_FIELDS.user],
      projectId: params.projectId,
      ruleId: params.ruleId,
    };
    const response: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.project.firestore.rule.patterns.deleteRule,
        payload,
      ),
    );
    this.afterCallMicroservice(response);
    return response.data;
  }

  @Get(':ruleId')
  async getFirestoreRule(@Req() request: Request, @Param() params: any) {
    const payload: MsGetProjectFirestoreRuleReqPayload = {
      user: request[REQUEST_FIELDS.user],
      projectId: params.projectId,
      ruleId: params.ruleId,
    };
    const response: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.project.firestore.rule.patterns.getRule,
        payload,
      ),
    );
    this.afterCallMicroservice(response);
    return response.data;
  }

  @Get('')
  async getAllFirestoreRules(@Req() request: Request, @Param() params: any) {
    const payload: MsGetAllProjectFirestoreRulesReqPayload = {
      user: request[REQUEST_FIELDS.user],
      projectId: params.projectId,
    };
    const response: ServiceResponse<any> = await firstValueFrom(
      this.clientProxy.send(
        microserviceConfig.project.firestore.rule.patterns.getAllRules,
        payload,
      ),
    );
    this.afterCallMicroservice(response);
    return response.data;
  }
}
