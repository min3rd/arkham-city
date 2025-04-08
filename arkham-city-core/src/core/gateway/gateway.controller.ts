import { BadRequestAlertException } from '../exceptions/BadRequestAlertException';
import { MicroserviceResponse } from '../microservice/microservice.types';

export class GatewayController {
  afterCallMicroservice(res: MicroserviceResponse<any>) {
    if (res.error) {
      throw new BadRequestAlertException(res.errorCode);
    }
  }
}
