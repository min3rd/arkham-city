import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User } from './user.type';
import { Role } from '../role/role.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RoleService } from '../role/role.service';
import { RoleAssignmentService } from '../role/role-assignment.service';
import { Errors } from 'src/core/microservice/microservice.types';
import { HashService } from 'src/core/hash/hash.service';

describe('UserService', () => {
  let service: UserService;

  const userModel = {
    findOne: jest.fn(),
    exists: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    startSession: jest.fn().mockResolvedValue({
      withTransaction: jest.fn(),
      endSession: jest.fn(),
    }),
  };

  const roleModel = {
    find: jest.fn(),
  };

  const jwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const configService = {
    get: jest.fn(),
  };

  const roleService = {
    findDefaults: jest.fn().mockResolvedValue([]),
  };

  const roleAssignmentService = {
    resolvePermissionScopes: jest.fn().mockResolvedValue({
      effective: [],
      system: [],
      project: [],
      resource: [],
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: RoleService, useValue: roleService },
        { provide: RoleAssignmentService, useValue: roleAssignmentService },
        { provide: getModelToken(User.name, 'metadata'), useValue: userModel },
        { provide: getModelToken(Role.name, 'metadata'), useValue: roleModel },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should block disabled users from logging in', async () => {
    const userDoc: any = {
      email: 'user@test.com',
      password: HashService.hash('password'),
      status: 'disabled',
      populate: jest.fn().mockResolvedValue(null),
    };
    userModel.findOne.mockResolvedValue(userDoc);

    const res = await service.findOneByEmailAndPassword(
      'user@test.com',
      'password',
    );

    expect(res.error).toBe(true);
    expect(res.errorCode).toBe(Errors.USER_DISABLED);
  });

  it('should set user status to disabled', async () => {
    const userDoc: any = {
      _id: 'user-1',
      email: 'user@test.com',
      status: 'active',
      roles: [],
      save: jest.fn(),
      populate: jest.fn(),
      toJSON: jest.fn(),
    };
    userDoc.toJSON.mockImplementation(() => ({
      _id: 'user-1',
      status: userDoc.status,
    }));
    userDoc.save.mockResolvedValue(userDoc);
    userDoc.populate.mockResolvedValue(userDoc);
    userModel.findById.mockResolvedValue(userDoc);

    const res = await service.setStatus('user-1', {
      status: 'disabled',
    });

    expect(res.error).toBe(false);
    expect(userDoc.status).toBe('disabled');
    expect(userDoc.activated).toBe(false);
  });

  it('should prevent creating duplicated email', async () => {
    userModel.exists.mockResolvedValue(true);

    const res = await service.create({
      email: 'dup@test.com',
    } as any);

    expect(res.error).toBe(true);
    expect(res.errorCode).toBe(Errors.DUPLICATE_EMAIL);
  });
});
