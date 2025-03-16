import { MicroserviceResponse } from '../../core/microservice/microservice.type';
import { BadRequestAlertException } from '../../core/exceptions/BadRequestAlertException';

export class BaseService {
  public afterCallMicroservice(res: MicroserviceResponse<any>) {
    if (res.error) {
      throw new BadRequestAlertException(res.errorCode);
    }
  }
}
