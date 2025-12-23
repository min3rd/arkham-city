import { Module } from '@nestjs/common';
import { ModulesModule } from 'src/modules/modules.module';
import { MsProjectModule } from './ms-project/ms-project.module';
import { MsUserModule } from './ms-user/ms-user.module';
import { MsFirestoreModule } from './ms-firestore/ms-firestore.module';
import { MsWebsdkModule } from './ms-websdk/ms-websdk.module';
import { MsStorageModule } from './ms-storage/ms-storage.module';
import { MsRoleModule } from './ms-role/ms-role.module';

@Module({
  imports: [
    ModulesModule,
    MsProjectModule,
    MsUserModule,
    MsFirestoreModule,
    MsWebsdkModule,
    MsStorageModule,
    MsRoleModule,
  ],
  exports: [
    MsProjectModule,
    MsUserModule,
    MsFirestoreModule,
    MsWebsdkModule,
    MsStorageModule,
    MsRoleModule,
  ],
})
export class MicroservicesModule {}
