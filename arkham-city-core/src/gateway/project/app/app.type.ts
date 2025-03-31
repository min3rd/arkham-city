import { APP_TYPE } from "src/modules/project/app/app.type";

export interface CreateProjectAppReqDto {
  name: string;
  type: APP_TYPE;
  callback: string;
  description?: string;
}

export interface UpdateProjectAppReqDto {
  name: string;
  type: APP_TYPE;
  callback: string;
  description?: string;
}
