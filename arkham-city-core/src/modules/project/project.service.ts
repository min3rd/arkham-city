import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './project.type';
import { Model } from 'mongoose';
import {
  BadMicroserviceResponse,
  MicroserviceErrorCode,
  SuccessMicroserviceResponse,
} from 'src/core/microservice/microservice.types';
import { JWTPayload } from '../auth/auth.interface';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name, 'metadata') private projectModel: Model<Project>,
  ) {}
  async create(user: JWTPayload, name: string, description: string = '') {
    const check = await this.projectModel.find({
      name: name,
      user: {
        username: user.username,
      },
    });
    if (check.length > 0) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.PROJECT_ALREADY_EXIST,
      );
    }
    let project = new this.projectModel({
      name: name,
      description: description,
      user: {
        username: user.username,
      },
    });
    project = await project.save();
    return new SuccessMicroserviceResponse({
      ...project.toJSON(),
      user: undefined,
    });
  }

  async update(projectId: string, name: string, description?: string) {
    let project = await this.projectModel.findById(projectId);
    if (!project) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.INCORRECT_PROJECT_ID,
      );
    }
    if (
      (await this.projectModel.find({ id: projectId, name: name })).length > 0
    ) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.PROJECT_ALREADY_EXIST,
      );
    }
    project.name = name;
    project.description = description;
    project = await project.save();
    return new SuccessMicroserviceResponse({
      ...project.toJSON(),
      user: undefined,
    });
  }

  async all(user: JWTPayload) {
    const all = await this.projectModel.find({
      user: { username: user.username },
      activated: true,
    });
    return new SuccessMicroserviceResponse(
      all.map((e) => ({
        ...e.toJSON(),
        user: undefined,
      })),
    );
  }

  async findById(user: JWTPayload, projectId: string) {
    const project = await this.projectModel.findOne({
      _id: projectId,
      user: {
        username: user.username,
      },
      activated: true,
    });
    return new SuccessMicroserviceResponse({
      ...project?.toJSON(),
      user: undefined,
    });
  }
}
