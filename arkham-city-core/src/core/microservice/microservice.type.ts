export interface MicroserviceResponse<T> {
  error: boolean;
  errorCode: IErrorCode;
  data?: T;
}

export class BadMicroserviceResponse<T> implements MicroserviceResponse<T> {
  error: boolean = true;
  errorCode: IErrorCode;
  data?: T | undefined;
  constructor(errorCode: IErrorCode = MicroserviceErrorCode.DEFAULT) {
    this.errorCode = errorCode;
  }
}

export class SuccessMicroserviceResponse<T> implements MicroserviceResponse<T> {
  error: boolean = false;
  errorCode: IErrorCode = MicroserviceErrorCode.DEFAULT;
  data: T;
  constructor(data: T) {
    this.data = data;
  }
}

export class IErrorCode {
  code: string;
  message: string;
  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }
}

export class MicroserviceErrorCode {
  static readonly DEFAULT = new IErrorCode('00x0000', 'Unknow error');
  static readonly DUPLICATE_EMAIL = new IErrorCode(
    '01x0001',
    'The email already registerd',
  );
  static readonly EMAIL_NOT_FOUND = new IErrorCode(
    '01x0002',
    'The email was not registered',
  );
  static readonly PASSWORD_IS_INCORRECT = new IErrorCode(
    '01x0003',
    'The password was incorrected',
  );
  static readonly USER_NOT_FOUND = new IErrorCode(
    '01x0004',
    'The user can not be founded',
  );
  static readonly INCORRECT_REFRESH_TOKEN = new IErrorCode(
    '01x0005',
    'The refresh token was incorrected',
  );
  static readonly PROJECT_ALREADY_EXIST = new IErrorCode(
    '01x0006',
    'The project was already registered',
  );
  static readonly INCORRECT_PROJECT_ID = new IErrorCode(
    '01x0007',
    'The project id was incorrected',
  );
}
