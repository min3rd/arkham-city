import { HttpException, HttpStatus } from '@nestjs/common';
import { IErrorCode } from '../microservice/microservice.types';
export class BadRequestAlertException extends HttpException {
  errorCode!: IErrorCode;
  constructor(errorCode: IErrorCode) {
    super(errorCode.code, HttpStatus.BAD_REQUEST);
    this.errorCode = errorCode;
  }
  getResponse(): string | object {
    return {
      timestamp: new Date(),
      statusCode: this.getStatus(),
      errorCode: this.errorCode.code,
      message: this.errorCode.message ?? 'undefined message',
    };
  }
}
