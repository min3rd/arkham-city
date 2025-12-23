import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.type';
import { HashService } from 'src/core/hash/hash.service';
import { UserService } from './user.service';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'metadata',
    ),
    RoleModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
