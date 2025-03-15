import { HttpException, HttpStatus } from '@nestjs/common';
import { MicroserviceErrorCode } from '../microservice/microservice.type';
import ErrorMessage from '../microservice/error.type';

export class BadRequestAlertException extends HttpException {
  errorCode!: MicroserviceErrorCode;
  constructor(errorCode: MicroserviceErrorCode) {
    super(errorCode as string, HttpStatus.BAD_REQUEST);
    this.errorCode = errorCode;
  }
  getResponse(): string | object {
    return {
      statusCode: this.getStatus(),
      errorCode: this.errorCode,
      message: (ErrorMessage[this.errorCode] as string) ?? 'undefined message',
    };
  }
}
