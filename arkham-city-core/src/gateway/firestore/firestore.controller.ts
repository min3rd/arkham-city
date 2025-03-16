import { Body, Controller, Param, Post } from '@nestjs/common';

@Controller('firestore')
export class FirestoreController {
  @Post(':schemaName')
  create(@Param() params: any, @Body() data: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
    return { params, data };
  }
}
