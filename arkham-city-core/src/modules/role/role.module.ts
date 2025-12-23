import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './role.type';
import { RoleService } from './role.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature(
      [{ name: Role.name, schema: RoleSchema }],
      'metadata',
    ),
  ],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
