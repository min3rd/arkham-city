export interface ProjectResDto {
  _id: string;
  name: string;
  description?: string;
}

export interface NewProjectReqDto {
  name: string;
  description?: string;
}
