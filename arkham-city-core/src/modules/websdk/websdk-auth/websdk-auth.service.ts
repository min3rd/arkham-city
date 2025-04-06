import { Injectable, Logger } from '@nestjs/common';
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
import { HashService } from 'src/core/hash/hash.service';

@Injectable()
export class WebSDKAuthService {
  private readonly logger = new Logger(WebSDKAuthService.name);
  constructor(
    @InjectModel(ProjectApp.name, 'metadata')
    private readonly projectAppMode: Model<ProjectApp>,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}
  async authenticate(
    projectId: string,
    appId: string,
    secretKey: string,
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
      this.hashService.decrypt(projectApp.secretKey, projectApp.privateKey)
    ) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.WEB_SDK_SECRET_WAS_INCORRECT,
      );
    }
    const payload: JWTPayload = {
      type: 'websdk',
      sub: projectId,
      username: appId,
    };
    this.logger.log(`authenticate:end`);
    return new SuccessMicroserviceResponse<SDKAuthResDto>({
      accessToken: await this.jwtService.signAsync(payload),
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
