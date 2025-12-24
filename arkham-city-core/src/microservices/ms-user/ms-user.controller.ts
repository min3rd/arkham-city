import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';
import { UserService } from '../../modules/user/user.service';
import {
  LogInByEmailAndPassword,
  LogInByRefreshToken,
  RegisterByEmailAndPasswordDto,
} from '../../modules/auth/auth.interface';
import {
  AdminCreateUserDto,
  AdminUpdateUserDto,
  AssignRolesDto,
  ListUsersDto,
  SetUserStatusDto,
} from 'src/modules/user/user.interface';

@Controller()
export class MsUserController {
  private readonly logger = new Logger(MsUserController.name);

  constructor(private readonly userService: UserService) {}

  @MessagePattern(microserviceConfig.auth.patterns.registerByEmailAndPassword)
  registerByEmailAndPassword(
    @Payload() payload: RegisterByEmailAndPasswordDto,
  ) {
    this.logger.debug('Registering user by email and password', payload);
    return this.userService.registerByEmailAndPassword(
      payload.email,
      payload.password,
      payload.firstName,
      payload.lastName,
    );
  }

  @MessagePattern(microserviceConfig.auth.patterns.logInByEmailAndPassword)
  logInByEmailAndPassword(@Payload() payload: LogInByEmailAndPassword) {
    return this.userService.findOneByEmailAndPassword(
      payload.email,
      payload.password,
    );
  }

  @MessagePattern(microserviceConfig.auth.patterns.logInByRefreshToken)
  logInByRefreshToken(@Payload() payload: LogInByRefreshToken) {
    return this.userService.findOneByRefreshToken(payload.refreshToken);
  }

  @MessagePattern(microserviceConfig.user.patterns.create)
  create(@Payload() payload: AdminCreateUserDto) {
    return this.userService.create(payload);
  }

  @MessagePattern(microserviceConfig.user.patterns.update)
  update(@Payload() payload: AdminUpdateUserDto & { userId: string }) {
    return this.userService.update(payload.userId, payload);
  }

  @MessagePattern(microserviceConfig.user.patterns.get)
  get(@Payload() payload: { userId: string }) {
    return this.userService.get(payload.userId);
  }

  @MessagePattern(microserviceConfig.user.patterns.list)
  list(@Payload() payload: ListUsersDto) {
    return this.userService.list(payload);
  }

  @MessagePattern(microserviceConfig.user.patterns.delete)
  delete(@Payload() payload: { userId: string }) {
    return this.userService.delete(payload.userId);
  }

  @MessagePattern(microserviceConfig.user.patterns.setStatus)
  setStatus(@Payload() payload: SetUserStatusDto & { userId: string }) {
    return this.userService.setStatus(payload.userId, payload);
  }

  @MessagePattern(microserviceConfig.user.patterns.assignRoles)
  assignRoles(@Payload() payload: AssignRolesDto & { userId: string }) {
    return this.userService.assignRoles(payload.userId, payload);
  }
}
