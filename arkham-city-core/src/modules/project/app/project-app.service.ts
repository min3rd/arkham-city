import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { APP_TYPE, ProjectApp } from './project-app.type';
import { Model } from 'mongoose';
import { JWTPayload } from 'src/modules/auth/auth.interface';
import {
  BadResponse,
  Errors,
  GoodResponse,
} from 'src/core/microservice/microservice.types';
import { randomBytes } from 'crypto';
import { HashService } from 'src/core/hash/hash.service';

@Injectable()
export class ProjectAppService {
  private readonly logger = new Logger(ProjectAppService.name);
  constructor(
    @InjectModel(ProjectApp.name, 'metadata')
    private readonly appModel: Model<ProjectApp>,
  ) {}

  async create(
    user: JWTPayload,
    projectId: string,
    name: string,
    type: APP_TYPE,
    callback: string,
    desctiption: string = '',
  ) {
    if (
      (
        await this.appModel.find({
          project: {
            _id: projectId,
          },
          name: name,
          user: {
            username: user.username,
          },
          activated: true,
        })
      ).length > 0
    ) {
      return new BadResponse(Errors.DUPLICATE_APP);
    }
    const rawSecret = randomBytes(
      parseInt(process.env.PROJECT_APP_SECRET_KEY_LENGTH as string) ?? 48,
    ).toString('base64');
    const privateKey = randomBytes(256).toString('base64url');
    const encrypted: string = HashService.encrypt<string>(
      rawSecret,
      privateKey,
    );
    let app = new this.appModel({
      project: {
        _id: projectId,
      },
      name: name,
      type: type,
      callback: callback,
      description: desctiption,
      secretKey: encrypted,
      privateKey: privateKey,
      user: {
        username: user.username,
      },
    });
    app = await app.save();
    return new GoodResponse({
      ...app.toJSON(),
      secretKey: rawSecret,
      privateKey: undefined,
    });
  }

  async update(
    user: JWTPayload,
    projectId: string,
    appId: string,
    name: string,
    type: APP_TYPE,
    callback: string,
    desctiption: string = '',
  ) {
    let app = await this.appModel.findOne({
      _id: appId,
      project: {
        _id: projectId,
      },
      user: {
        username: user.username,
      },
    });
    if (!app) {
      return new BadResponse(Errors.APP_NOT_FOUND);
    }
    app.name = name;
    app.type = type;
    app.callback = callback;
    app.description = desctiption;
    app = await app.save();
    return new GoodResponse({
      ...app.toJSON(),
      secretKey: undefined,
      privateKey: undefined,
    });
  }

  async delete(user: JWTPayload, projectId: string, appId: string) {
    const app = await this.appModel.findOne({
      _id: appId,
      project: {
        _id: projectId,
      },
      user: {
        username: user.username,
      },
    });
    if (!app) {
      return new BadResponse(Errors.APP_NOT_FOUND);
    }
    app.activated = false;
    if (process.env.CORE_HARD_DELETE === 'true') {
      await app.deleteOne();
    } else {
      await app.save();
    }
    return new GoodResponse(true);
  }

  async all(user: JWTPayload, projectId: string) {
    const apps = await this.appModel.find({
      project: {
        _id: projectId,
      },
      user: {
        username: user.username,
      },
      activated: true,
    });
    return new GoodResponse(
      apps.map((e) => ({
        ...e.toJSON(),
        privateKey: undefined,
        secretKey: undefined,
      })),
    );
  }

  async get(user: JWTPayload, projectId: string, appId: string) {
    const app = await this.appModel.findOne({
      project: {
        _id: projectId,
      },
      user: {
        username: user.username,
      },
      _id: appId,
      activated: true,
    });
    if (!app) {
      return new BadResponse(Errors.APP_NOT_FOUND);
    }
    return new GoodResponse({
      ...app.toJSON(),
      privateKey: undefined,
      secretKey: undefined,
    });
  }
  async getSecret(user: JWTPayload, projectId: string, appId: string) {
    this.logger.log(
      `getSecret:start:user=${user.username},projectId=${projectId},appId=${appId}`,
    );
    const app = await this.appModel.findOne({
      project: {
        _id: projectId,
      },
      user: {
        username: user.username,
      },
      _id: appId,
      activated: true,
    });
    if (!app) {
      return new BadResponse(Errors.APP_NOT_FOUND);
    }
    this.logger.log(
      `getSecret:end:user=${user.username},projectId=${projectId},appId=${appId}`,
    );
    return new GoodResponse({
      secret: HashService.decrypt(app.secretKey, app.privateKey),
    });
  }
}
