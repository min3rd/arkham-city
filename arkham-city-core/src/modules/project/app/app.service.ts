import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { App, APP_TYPE } from './app.type';
import { Model } from 'mongoose';
import { JWTPayload } from 'src/modules/auth/auth.type';
import {
  BadMicroserviceResponse,
  MicroserviceErrorCode,
} from 'src/core/microservice/microservice.type';
import { randomBytes, randomUUID } from 'crypto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(App.name, 'metadata') private readonly appModel: Model<App>,
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
        })
      ).length > 0
    ) {
      return new BadMicroserviceResponse(MicroserviceErrorCode.DULICATE_APP);
    }
    let app = new this.appModel({
      project: {
        _id: projectId,
      },
      name: name,
      type: type,
      callback: callback,
      description: desctiption,
      clientId: randomUUID(),
      secretKey: randomBytes(48).toString('base64'),
      user: user,
    });
    app = await app.save();
    return app.toJSON();
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
      user: user,
    });
    if (!app) {
      return new BadMicroserviceResponse(MicroserviceErrorCode.APP_NOT_FOUND);
    }
    app.name = name;
    app.type = type;
    app.callback = callback;
    app.description = desctiption;
    app = await app.save();
    return app.toJSON();
  }

  async delete(user: JWTPayload, projectId: string, appId: string) {
    const app = await this.appModel.findOne({
      _id: appId,
      project: {
        _id: projectId,
      },
      user: user,
    });
    if (!app) {
      return new BadMicroserviceResponse(MicroserviceErrorCode.APP_NOT_FOUND);
    }
    await app.deleteOne();
  }
}
