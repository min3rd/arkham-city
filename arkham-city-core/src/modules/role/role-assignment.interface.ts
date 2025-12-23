import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { RoleAssignmentScope } from './role-assignment.type';

const SCOPES: RoleAssignmentScope[] = ['global', 'project', 'resource'];

export class CreateRoleAssignmentDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  roleId: string;

  @IsString()
  @IsIn(SCOPES)
  scope: RoleAssignmentScope;

  @IsOptional()
  @IsMongoId()
  projectId?: string;

  @IsOptional()
  @IsString()
  resourceId?: string;
}

export class UpdateRoleAssignmentDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsMongoId()
  roleId?: string;

  @IsOptional()
  @IsString()
  @IsIn(SCOPES)
  scope?: RoleAssignmentScope;

  @IsOptional()
  @IsMongoId()
  projectId?: string;

  @IsOptional()
  @IsString()
  resourceId?: string;
}

export class ListRoleAssignmentDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsMongoId()
  roleId?: string;

  @IsOptional()
  @IsString()
  @IsIn(SCOPES)
  scope?: RoleAssignmentScope;

  @IsOptional()
  @IsMongoId()
  projectId?: string;

  @IsOptional()
  @IsString()
  resourceId?: string;
}
