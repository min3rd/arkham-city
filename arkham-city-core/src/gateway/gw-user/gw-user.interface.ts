import {
  AdminCreateUserDto,
  AdminUpdateUserDto,
  AssignRolesDto,
  ListUsersDto,
  SetUserStatusDto,
} from 'src/modules/user/user.interface';

export class GwCreateUserDto extends AdminCreateUserDto {}

export class GwUpdateUserDto extends AdminUpdateUserDto {}

export class GwAssignRolesDto extends AssignRolesDto {}

export class GwSetUserStatusDto extends SetUserStatusDto {}

export class GwListUsersDto extends ListUsersDto {}
