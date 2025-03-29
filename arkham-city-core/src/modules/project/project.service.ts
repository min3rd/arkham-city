import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './project.type';
import { Model } from 'mongoose';
import {
  BadMicroserviceResponse,
  MicroserviceErrorCode,
  SuccessMicroserviceResponse,
} from 'src/core/microservice/microservice.type';
import { User } from '../user/user.type';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name, 'metadata') private projectModel: Model<Project>,
  ) {}
  async create(user: User, name: string, description: string = '') {
    const check = await this.projectModel.find({
      name: name,
      user: user,
    });
    if (check.length > 0) {
      return new BadMicroserviceResponse(
        MicroserviceErrorCode.PROJECT_ALREADY_EXIST,
      );
    }
    let project = new this.projectModel({
      name: name,
      description: description,
      user: user,
    });
    project = await project.save();
    return new SuccessMicroserviceResponse({ ...project, user: undefined });
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
    return new SuccessMicroserviceResponse({ ...project, user: undefined });
  }

  async all(user: User) {
    const all = await this.projectModel.find({ user: user });
    return new SuccessMicroserviceResponse(
      all.map((e) => ({ ...e, user: undefined })),
    );
  }

  async findById(user: User, projectId: string) {
    const project = await this.projectModel.findOne({
      id: projectId,
      user: user,
    });
    return new SuccessMicroserviceResponse({ ...project, user: undefined });
  }
}
