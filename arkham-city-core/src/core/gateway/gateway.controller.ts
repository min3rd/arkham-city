import { BadRequestAlertException } from '../exceptions/BadRequestAlertException';
import { ServiceResponse } from '../microservice/microservice.types';

export class GatewayController {
  afterCallMicroservice(res: ServiceResponse<any>) {
    if (res.error) {
      throw new BadRequestAlertException(res.errorCode);
    }
  }
}
