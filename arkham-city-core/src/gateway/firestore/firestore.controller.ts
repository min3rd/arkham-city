import { Body, Controller, Param, Post } from '@nestjs/common';
import { GatewayController } from 'src/core/gateway/gateway.controller';
import { FirestoreService } from 'src/modules/firestore/firestore.service';

@Controller('firestore')
export class FirestoreController extends GatewayController {
  constructor(private readonly firestoreService: FirestoreService) {
    super();
  }
  @Post(':schemaName')
  create(@Param() params: any, @Body() data: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.firestoreService.callCreateRecord(params.schemaName, data);
  }
}
