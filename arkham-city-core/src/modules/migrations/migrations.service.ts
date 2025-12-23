import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';
import { Model } from 'mongoose';
import { Role } from '../role/role.type';
import { RoleAssignment } from '../role/role-assignment.type';
import { User } from '../user/user.type';
import { Migration } from './migrations.type';

type MigrationDefinition = {
  key: string;
  handler: () => Promise<void>;
};

const DUPLICATE_KEY_ERROR_CODE = 11000;

const SYSTEM_PERMISSIONS = ['roles:write', 'projects:read', 'projects:write'];

const PROJECT_READ_PERMISSIONS = [
  'project:read',
  'project:firestore:read',
  'project:storage:read',
];

const PROJECT_WRITE_PERMISSIONS = [
  'project:write',
  'project:firestore:write',
  'project:storage:write',
];

const DEFAULT_ROLES: Array<{
  name: string;
  description?: string;
  permissions: string[];
  default: boolean;
}> = [
  {
    name: 'admin',
    description: 'Full access to manage system and projects',
    permissions: [
      ...SYSTEM_PERMISSIONS,
      ...PROJECT_READ_PERMISSIONS,
      ...PROJECT_WRITE_PERMISSIONS,
    ],
    default: false,
  },
  {
    name: 'editor',
    description: 'Manage project data and storage',
    permissions: [...PROJECT_READ_PERMISSIONS, ...PROJECT_WRITE_PERMISSIONS],
    default: false,
  },
  {
    name: 'viewer',
    description: 'Read-only access to projects',
    permissions: PROJECT_READ_PERMISSIONS,
    default: true,
  },
];

@Injectable()
export class MigrationsService implements OnModuleInit {
  private readonly logger = new Logger(MigrationsService.name);
  private readonly migrations: MigrationDefinition[] = [
    {
      key: 'seed-default-roles-v1',
      handler: this.seedDefaultRoles.bind(this),
    },
    {
      key: 'assign-admin-role-v1',
      handler: this.assignAdminRoleToSuperAdmins.bind(this),
    },
  ];

  constructor(
    @InjectModel(Migration.name, 'metadata')
    private readonly migrationModel: Model<Migration>,
    @InjectModel(Role.name, 'metadata')
    private readonly roleModel: Model<Role>,
    @InjectModel(RoleAssignment.name, 'metadata')
    private readonly roleAssignmentModel: Model<RoleAssignment>,
    @InjectModel(User.name, 'metadata')
    private readonly userModel: Model<User>,
  ) {}

  async onModuleInit(): Promise<void> {
    for (const migration of this.migrations) {
      const shouldRun = await this.acquireMigration(migration.key);
      if (!shouldRun) {
        continue;
      }
      try {
        await migration.handler();
        this.logger.log(`Migration completed: ${migration.key}`);
      } catch (error) {
        this.logger.error(
          `Migration failed: ${migration.key}. It will be retried on next startup.`,
          error instanceof Error ? error.stack : String(error),
        );
        try {
          await this.migrationModel.deleteOne({ key: migration.key });
        } catch (cleanupError) {
          this.logger.error(
            `Failed to clean up migration record: ${migration.key}`,
            cleanupError instanceof Error
              ? cleanupError.stack
              : String(cleanupError),
          );
        }
      }
    }
  }

  private async acquireMigration(migrationKey: string): Promise<boolean> {
    try {
      await this.migrationModel.create({ key: migrationKey });
      return true;
    } catch (error) {
      if (
        error instanceof MongoServerError &&
        error.code === DUPLICATE_KEY_ERROR_CODE
      ) {
        return false;
      }
      throw error;
    }
  }

  private async seedDefaultRoles(): Promise<void> {
    await this.roleModel.bulkWrite(
      DEFAULT_ROLES.map((role) => ({
        updateOne: {
          filter: { name: role.name },
          update: {
            $set: {
              description: role.description,
              permissions: role.permissions,
              default: role.default,
            },
            $setOnInsert: {
              name: role.name,
            },
          },
          upsert: true,
        },
      })),
    );
  }

  private buildGlobalAssignmentFilter(userId: any, roleId: any) {
    return {
      user: userId,
      role: roleId,
      scope: 'global',
      projectId: { $in: [null, undefined] },
      resourceId: { $in: [null, undefined] },
    };
  }

  private async assignAdminRoleToSuperAdmins(): Promise<void> {
    const adminRole = await this.roleModel.findOne({ name: 'admin' });
    if (!adminRole) {
      return;
    }
    const superAdmins = await this.userModel.find({ superAdmin: true });
    if (superAdmins.length === 0) {
      return;
    }
    await this.roleAssignmentModel.bulkWrite(
      superAdmins.map((user) => ({
        updateOne: {
          filter: this.buildGlobalAssignmentFilter(user._id, adminRole._id),
          update: {
            $set: {
              scope: 'global',
            },
            $unset: { projectId: '', resourceId: '' },
            $setOnInsert: {
              user: user._id,
              role: adminRole._id,
            },
          },
          upsert: true,
        },
      })),
    );
  }
}
