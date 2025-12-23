import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

const SCOPES = ['global', 'project', 'resource'] as const;

export class GwCreateRoleAssignmentDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  roleId: string;

  @IsString()
  @IsIn(SCOPES)
  scope: (typeof SCOPES)[number];

  @IsOptional()
  @IsMongoId()
  projectId?: string;

  @IsOptional()
  @IsString()
  resourceId?: string;
}

export class GwUpdateRoleAssignmentDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsMongoId()
  roleId?: string;

  @IsOptional()
  @IsString()
  @IsIn(SCOPES)
  scope?: (typeof SCOPES)[number];

  @IsOptional()
  @IsMongoId()
  projectId?: string;

  @IsOptional()
  @IsString()
  resourceId?: string;
}

export class GwListRoleAssignmentDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsMongoId()
  roleId?: string;

  @IsOptional()
  @IsString()
  @IsIn(SCOPES)
  scope?: (typeof SCOPES)[number];

  @IsOptional()
  @IsMongoId()
  projectId?: string;

  @IsOptional()
  @IsString()
  resourceId?: string;
}
