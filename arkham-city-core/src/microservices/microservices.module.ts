import { Module } from '@nestjs/common';
import { ModulesModule } from 'src/modules/modules.module';
import { MsProjectModule } from './ms-project/ms-project.module';
import { MsUserModule } from './ms-user/ms-user.module';
import { MsFirestoreModule } from './ms-firestore/ms-firestore.module';
import { MsWebsdkModule } from './ms-websdk/ms-websdk.module';
import { MsStorageModule } from './ms-storage/ms-storage.module';

@Module({
  imports: [
    ModulesModule,
    MsProjectModule,
    MsUserModule,
    MsFirestoreModule,
    MsWebsdkModule,
    MsStorageModule,
  ],
  exports: [
    MsProjectModule,
    MsUserModule,
    MsFirestoreModule,
    MsWebsdkModule,
    MsStorageModule,
  ],
})
export class MicroservicesModule {}
