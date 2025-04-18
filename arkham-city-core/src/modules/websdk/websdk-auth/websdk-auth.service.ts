import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { BadResponse, Errors, GoodResponse, ServiceResponse } from 'src/core/microservice/microservice.types';
import { ProjectApp } from 'src/modules/project/app/project-app.type';
import { SDKAuthResDto, SDKJwtPayload } from './websdk-auth.interface';
import { HashService } from 'src/core/hash/hash.service';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/modules/database/database.service';
import { WebSDKUserSchema } from './websdk-auth.types';

/**
 * @author Vu Van Minh
 */
@Injectable()
export class WebSDKAuthService {
  private readonly logger = new Logger(WebSDKAuthService.name);
  public static readonly userSchemaName: string = 'user';

  constructor(
    @InjectModel(ProjectApp.name, 'metadata')
    private readonly projectAppModel: Model<ProjectApp>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   *
   * @param projectId string
   * @param appId string
   * @param secretKey string
   * @returns ServiceResponse
   */
  async authenticate(
    projectId: string,
    appId: string,
    secretKey: string,
  ): Promise<ServiceResponse<any>> {
    this.logger.log(
      `authenticate:start:projectId=${projectId},appId=${appId},secretKey=${secretKey}`,
    );
    const projectApp = await this.findProjectApp(projectId, appId);
    if (!projectApp) {
      return new BadResponse(Errors.WEB_SDK_CAN_NOT_FIND_THE_APP);
    }
    if (
      secretKey !=
      HashService.decrypt(projectApp.secretKey, projectApp.privateKey)
    ) {
      return new BadResponse(Errors.WEB_SDK_SECRET_WAS_INCORRECT);
    }
    const returnedPayload: SDKJwtPayload = {
      type: 'websdk',
      projectId: projectId,
      appId: appId,
    };
    this.logger.log(`authenticate:end`);
    return new GoodResponse<SDKAuthResDto>({
      accessToken: await this.jwtService.signAsync(returnedPayload),
    });
  }

  /**
   *
   * @param auth
   * @param email
   * @param password
   * @returns
   */
  async logInByEmailAndPassword(
    auth: SDKJwtPayload,
    email: string,
    password: string,
  ) {
    this.logger.log('logInByEmailAndPassword:start', auth, email, password);
    const connection = this.databaseService.createProjectConnection(
      auth.projectId as string,
    );
    const _UserModel = this.userModel(connection);
    const user = await _UserModel.findOne({
      email: email,
    });
    if (!user) {
      return new BadResponse(Errors.WEB_SDK_AUTH_USER_NOT_FOUND);
    }
    if (!HashService.compare(password, user.password)) {
      return new BadResponse(Errors.WEB_SDK_AUTH_PASSWORD_WAS_INCORRECTED);
    }
    const payload: SDKJwtPayload = {
      type: 'websdk',
      projectId: auth.projectId,
      appId: auth.appId,
      sub: user._id,
      username: user.username,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    this.logger.log('logInByEmailAndPassword:end');
    return new GoodResponse({
      accessToken: accessToken,
      user: {
        ...user.toJSON(),
        password: undefined,
      },
    });
  }

  /**
   *
   * @param auth
   * @param email
   * @param password
   * @returns
   */
  async registerByEmailAndPassword(
    auth: SDKJwtPayload,
    email: string,
    password: string,
  ) {
    this.logger.log('registerByEmailAndPassword:start', auth, email, password);
    const connection = this.databaseService.createProjectConnection(
      auth.projectId as string,
    );
    const _UserModel = this.userModel(connection);

    const exist = await _UserModel.exists({
      email: email,
    });

    if (exist) {
      return new BadResponse(Errors.WEB_SDK_AUTH_EMAIL_ALREADY_REGISTERED);
    }

    let user = new _UserModel({
      email: email,
      password: HashService.hash(password),
      verified: !this.configService.get('AUTH_AUTO_VERIFY') ? false : true,
    });
    user = await user.save();
    if (!user) {
      return new BadResponse(Errors.WEB_SDK_AUTH_COULD_NOT_CREATE_NEW_USER);
    }
    this.logger.log('registerByEmailAndPassword:end');
    return new GoodResponse({
      ...user.toJSON(),
      password: undefined,
    });
  }

  //
  // Private area
  //

  /**
   *
   * @param connection
   * @returns
   */
  private userModel(connection: Connection) {
    return connection.model(WebSDKAuthService.userSchemaName, WebSDKUserSchema);
  }

  /**
   *
   * @param projectId
   * @param appId
   * @returns
   */
  private findProjectApp(projectId: string, appId: string) {
    return this.projectAppModel.findOne({
      _id: appId,
      project: {
        _id: projectId,
      },
    });
  }
}
