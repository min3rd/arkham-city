import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadMicroserviceResponse,
  MicroserviceErrorCode,
  MicroserviceResponse,
  SuccessMicroserviceResponse,
} from 'src/core/microservice/microservice.types';
import { ProjectApp } from 'src/modules/project/app/project-app.type';
import { SDKAuthResDto, SDKJwtPayload } from './websdl-auth.interface';
import { HashService } from 'src/core/hash/hash.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebSDKAuthService {
  private readonly logger = new Logger(WebSDKAuthService.name);
  constructor(
    @InjectModel(ProjectApp.name, 'metadata')
    private readonly projectAppMode: Model<ProjectApp>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async authenticate(
    projectId: string,
    appId: string,
    secretKey: string,
    userToken?: string,
  ): Promise<MicroserviceResponse<any>> {
    this.logger.log(
      `authenticate:start:projectId=${projectId},appId=${appId},secretKey=${secretKey}`,
    );
    const projectApp = await this.find(projectId, appId);
    if (!projectApp) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.WEB_SDK_CAN_NOT_FIND_THE_APP,
      );
    }
    if (
      secretKey !=
      HashService.decrypt(projectApp.secretKey, projectApp.privateKey)
    ) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.WEB_SDK_SECRET_WAS_INCORRECT,
      );
    }
    let payload: any = undefined;
    if (userToken) {
      // log-in with user information
      payload = await this.jwtService.verifyAsync(userToken, {
        secret: this.configService.get('JWT_SECRET'),
      });
      if (payload) {
      }
    }
    const returnedPayload: SDKJwtPayload = {
      type: 'websdk',
      projectId: projectId,
      appId: appId,
      username: payload?.username,
      sub: payload?.sub,
      email: payload?.email,
    };
    this.logger.log(`authenticate:end`);
    return new SuccessMicroserviceResponse<SDKAuthResDto>({
      accessToken: await this.jwtService.signAsync(returnedPayload),
    });
  }
  async find(projectId: string, appId: string) {
    return await this.projectAppMode.findOne({
      _id: appId,
      project: {
        _id: projectId,
      },
    });
  }
}
