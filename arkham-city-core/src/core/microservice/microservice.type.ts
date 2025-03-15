export interface MicroserviceResponse<T> {
  error: boolean;
  errorCode: MicroserviceErrorCode;
  data?: T;
}

export class BadMicroserviceResponse<T> implements MicroserviceResponse<T> {
  error: boolean = true;
  errorCode: MicroserviceErrorCode;
  data?: T | undefined;
  constructor(errorCode: MicroserviceErrorCode) {
    this.errorCode = errorCode;
  }
}

export class SuccessMicroserviceResponse<T> implements MicroserviceResponse<T> {
  error: boolean = false;
  errorCode: MicroserviceErrorCode = MicroserviceErrorCode.DEFAULT;
  data?: T | undefined;
  constructor(data: T) {
    this.data = data;
  }
}
export enum MicroserviceErrorCode {
  DEFAULT = '00x0000',
  DUPLICATE_EMAIL = '01x0001',
  EMAIL_NOT_FOUND = '01x0002',
  PASSWORD_IS_INCORRECT = '01x0003',
}
