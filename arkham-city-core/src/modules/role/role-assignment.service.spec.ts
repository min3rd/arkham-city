import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RoleAssignmentService } from './role-assignment.service';
import { RoleAssignment } from './role-assignment.type';
import { Role } from './role.type';
import { User } from '../user/user.type';
import { Errors } from 'src/core/microservice/microservice.types';

describe('RoleAssignmentService', () => {
  let service: RoleAssignmentService;

  const roleAssignmentModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const roleModel = {
    find: jest.fn(),
    findById: jest.fn(),
  };

  const userModel = {
    exists: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleAssignmentService,
        { provide: getModelToken(RoleAssignment.name, 'metadata'), useValue: roleAssignmentModel },
        { provide: getModelToken(Role.name, 'metadata'), useValue: roleModel },
        { provide: getModelToken(User.name, 'metadata'), useValue: userModel },
      ],
    }).compile();

    service = module.get<RoleAssignmentService>(RoleAssignmentService);
  });

  it('should validate project scoped assignment', async () => {
    const result = await service.create({
      userId: 'user-id',
      roleId: 'role-id',
      scope: 'project',
    });
    expect(result.error).toBe(true);
    expect(result.errorCode).toBe(Errors.ROLE_ASSIGNMENT_PROJECT_REQUIRED);
  });

  it('should combine global, project and resource permissions', async () => {
    const baseUser: any = {
      _id: 'user-id',
      permissions: ['base'],
      roles: ['role-id'],
      populate: jest.fn().mockResolvedValue(null),
    };
    baseUser.populate.mockResolvedValue(baseUser);
    userModel.findById.mockReturnValue(baseUser);
    roleModel.find.mockResolvedValue([{ permissions: ['role:perm'] }]);
    roleAssignmentModel.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        { scope: 'global', role: { permissions: ['global:perm'] } },
        {
          scope: 'project',
          projectId: 'project-1',
          role: { permissions: ['project:perm'] },
        },
        {
          scope: 'resource',
          resourceId: 'resource-1',
          role: { permissions: ['resource:perm'] },
        },
      ]),
    });

    const result = (await service.resolvePermissionScopes('user-id', {
      projectId: 'project-1',
      resourceId: 'resource-1',
    })) as any;

    expect(result.system).toEqual(
      expect.arrayContaining(['base', 'role:perm', 'global:perm']),
    );
    expect(result.project).toEqual(expect.arrayContaining(['project:perm']));
    expect(result.resource).toEqual(expect.arrayContaining(['resource:perm']));
    expect(result.effective).toEqual(
      expect.arrayContaining([
        'base',
        'role:perm',
        'global:perm',
        'project:perm',
        'resource:perm',
      ]),
    );
  });

  it('should return user not found when missing id', async () => {
    const result = await service.getPermissionScopes(undefined);
    expect(result.error).toBe(true);
    expect(result.errorCode).toBe(Errors.USER_NOT_FOUND);
  });
});
