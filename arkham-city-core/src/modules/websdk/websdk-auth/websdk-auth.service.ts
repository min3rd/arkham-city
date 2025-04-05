import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadMicroserviceResponse,
  MicroserviceErrorCode,
  MicroserviceResponse,
  SuccessMicroserviceResponse,
} from 'src/core/microservice/microservice.type';
import { JWTPayload } from 'src/modules/auth/auth.type';
import { ProjectApp } from 'src/modules/project/app/project-app.type';
import { SDKAuthResDto } from './websdl-auth.interface';

@Injectable()
export class WebSDKAuthService {
  constructor(
    @InjectModel(ProjectApp.name, 'metadata')
    private readonly projectAppMode: Model<ProjectApp>,
    private readonly jwtService: JwtService,
  ) {}
  async authenticate(
    projectId: string,
    appId: string,
    secretKey: string,
  ): Promise<MicroserviceResponse<any>> {
    const projectApp = await this.find(projectId, appId, secretKey);
    if (!projectApp) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.WEB_SDK_CAN_NOT_FIND_THE_APP,
      );
    }
    const payload: JWTPayload = {
      type: 'websdk',
      sub: projectId,
      username: appId,
    };
    return new SuccessMicroserviceResponse<SDKAuthResDto>({
      accessToken: await this.jwtService.signAsync(payload),
    });
  }
  async find(projectId: string, appId: string, secretKey: string) {
    return await this.projectAppMode.findOne({
      _id: appId,
      project: {
        _id: projectId,
      },
      secretKey: secretKey,
    });
  }
}
