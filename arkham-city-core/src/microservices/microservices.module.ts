import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ModulesModule } from 'src/modules/modules.module';
import { MsProjectModule } from './ms-project/ms-project.module';
import { MsUserModule } from './ms-user/ms-user.module';
import { MsFirestoreModule } from './ms-firestore/ms-firestore.module';
import { MsWebsdkModule } from './ms-websdk/ms-websdk.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ModulesModule,
    MsProjectModule,
    MsUserModule,
    MsFirestoreModule,
    MsWebsdkModule,
  ],
})
export class MicroservicesModule {}
