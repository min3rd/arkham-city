import { Logger } from '@nestjs/common';

export interface MicroserviceResponse<T> {
  error: boolean;
  errorCode: IErrorCode;
  data?: T;
}

export class BadMicroserviceResponse<T> implements MicroserviceResponse<T> {
  private readonly logger = new Logger(BadMicroserviceResponse.name);
  error: boolean = true;
  errorCode: IErrorCode;
  data?: T | undefined;
  constructor(errorCode: IErrorCode = MicroserviceErrorCode.DEFAULT) {
    this.errorCode = errorCode;
    this.logger.error(
      `BadMicroserviceResponse:errorCode=${errorCode.code},message=${errorCode.message}`,
    );
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
  static readonly DULICATE_APP = new IErrorCode(
    '01x0008',
    'The app was already exists',
  );
  static readonly APP_NOT_FOUND = new IErrorCode(
    '01x0009',
    'Could not find the app',
  );
  static readonly COULD_NOT_SAVE_THE_RECORD = new IErrorCode(
    '01x0010',
    'Could not save the record',
  );
  static readonly WEB_SDK_CAN_NOT_FIND_THE_APP = new IErrorCode(
    '01x0011',
    'Could not find the app',
  );
  static readonly WEB_SDK_SECRET_WAS_INCORRECT = new IErrorCode(
    '01x0012',
    'The secret key was incorrect',
  );

  static readonly WEB_SDK_FIRESTORE_COULD_NOT_FOUND_SCHEMA = new IErrorCode(
    '01x0013',
    'Could not found the schema',
  );

  static readonly WEB_SDK_FIRESTORE_COULD_NOT_FOUND_RECORD = new IErrorCode(
    '01x0014',
    'Could not found the record',
  );

  static readonly WEB_SDK_FIRESTORE_COULD_NOT_PARTIAL_UPDATE = new IErrorCode(
    '01x0015',
    'Could not partial update the record',
  );

  static readonly WEB_SDK_FIRESTORE_ID_WAS_NOT_MATCHED = new IErrorCode(
    '01x0016',
    "The record's id was not matched",
  );
}
