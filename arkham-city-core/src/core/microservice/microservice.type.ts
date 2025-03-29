export interface MicroserviceResponse<T> {
  error: boolean;
  errorCode: MicroserviceErrorCode;
  data?: T;
}

export class BadMicroserviceResponse<T> implements MicroserviceResponse<T> {
  error: boolean = true;
  errorCode: MicroserviceErrorCode;
  data?: T | undefined;
  constructor(
    errorCode: MicroserviceErrorCode = MicroserviceErrorCode.DEFAULT,
  ) {
    this.errorCode = errorCode;
  }
}

export class SuccessMicroserviceResponse<T> implements MicroserviceResponse<T> {
  error: boolean = false;
  errorCode: MicroserviceErrorCode = MicroserviceErrorCode.DEFAULT;
  data: T;
  constructor(data: T) {
    this.data = data;
  }
}
export enum MicroserviceErrorCode {
  DEFAULT = '00x0000',
  DUPLICATE_EMAIL = '01x0001',
  EMAIL_NOT_FOUND = '01x0002',
  PASSWORD_IS_INCORRECT = '01x0003',
  USER_NOT_FOUND = '01x0004',
  INCORRECT_REFRESH_TOKEN = '01x0005',
  PROJECT_ALREADY_EXIST = '01x0006',
  INCORRECT_PROJECT_ID = '01x0007',
}
