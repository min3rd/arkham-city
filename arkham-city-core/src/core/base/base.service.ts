import { Injectable } from '@nestjs/common';
import { MicroserviceResponse } from '../microservice/microservice.type';
import { BadRequestAlertException } from '../exceptions/BadRequestAlertException';

@Injectable()
export class BaseService {
  public afterCallMicroservice(res: MicroserviceResponse<any>) {
    if (res.error) {
      throw new BadRequestAlertException(res.errorCode);
    }
  }
}
