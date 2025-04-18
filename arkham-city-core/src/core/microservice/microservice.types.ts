import { Logger } from '@nestjs/common';

export interface ServiceResponse<T> {
  error: boolean;
  errorCode: Error;
  data?: T;
}

export class BadResponse<T> implements ServiceResponse<T> {
  private readonly logger = new Logger(BadResponse.name);
  error: boolean = true;
  errorCode: Error;
  data?: T | undefined;

  constructor(errorCode: Error = Errors.DEFAULT) {
    this.errorCode = errorCode;
    this.logger.error(
      `BadMicroserviceResponse:errorCode=${errorCode.code},message=${errorCode.message}`,
    );
  }
}

export class GoodResponse<T> implements ServiceResponse<T> {
  error: boolean = false;
  errorCode: Error = Errors.DEFAULT;
  data: T | undefined;

  constructor(data?: T) {
    this.data = data ?? undefined;
  }
}

export class Error {
  code: string;
  message: string;

  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }
}

export class Errors {
  static readonly DEFAULT = new Error('00x0000', 'Unknow error');
  static readonly DUPLICATE_EMAIL = new Error(
    '01x0001',
    'The email already registered',
  );
  static readonly EMAIL_NOT_FOUND = new Error(
    '01x0002',
    'The email was not registered',
  );
  static readonly PASSWORD_IS_INCORRECT = new Error(
    '01x0003',
    'The password was incorrected',
  );
  static readonly USER_NOT_FOUND = new Error(
    '01x0004',
    'The user can not be founded',
  );
  static readonly INCORRECT_REFRESH_TOKEN = new Error(
    '01x0005',
    'The refresh token was incorrected',
  );
  static readonly PROJECT_ALREADY_EXIST = new Error(
    '01x0006',
    'The project was already registered',
  );
  static readonly INCORRECT_PROJECT_ID = new Error(
    '01x0007',
    'The project id was incorrected',
  );
  static readonly DUPLICATE_APP = new Error(
    '01x0008',
    'The app was already exists',
  );
  static readonly APP_NOT_FOUND = new Error(
    '01x0009',
    'Could not find the app',
  );
  static readonly COULD_NOT_SAVE_THE_RECORD = new Error(
    '01x0010',
    'Could not save the record',
  );
  static readonly WEB_SDK_CAN_NOT_FIND_THE_APP = new Error(
    '01x0011',
    'Could not find the app',
  );
  static readonly WEB_SDK_SECRET_WAS_INCORRECT = new Error(
    '01x0012',
    'The secret key was incorrect',
  );

  static readonly WEB_SDK_FIRESTORE_COULD_NOT_FOUND_SCHEMA = new Error(
    '01x0013',
    'Could not found the schema',
  );

  static readonly WEB_SDK_FIRESTORE_COULD_NOT_FOUND_RECORD = new Error(
    '01x0014',
    'Could not found the record',
  );

  static readonly WEB_SDK_FIRESTORE_COULD_NOT_PARTIAL_UPDATE = new Error(
    '01x0015',
    'Could not partial update the record',
  );

  static readonly WEB_SDK_FIRESTORE_ID_WAS_NOT_MATCHED = new Error(
    '01x0016',
    "The record's id was not matched",
  );

  static readonly WEB_SDK_AUTH_USER_NOT_FOUND = new Error(
    '01x0017',
    'Could not found the user',
  );

  static readonly WEB_SDK_AUTH_PASSWORD_WAS_INCORRECTED = new Error(
    '01x0018',
    'The password was incorrected',
  );

  static readonly WEB_SDK_AUTH_COULD_NOT_CREATE_NEW_USER = new Error(
    '01x0019',
    'Could not create new user',
  );

  static readonly WEB_SDK_AUTH_EMAIL_ALREADY_REGISTERED = new Error(
    '01x0020',
    'The email was already registered',
  );

  static readonly PROJECT_FIRESTORE_RULE_COULD_NOT_FOUND = new Error(
    '01x0021',
    'Could not found the rule',
  );

  static readonly PROJECT_FIRESTORE_RULE_ALREADY_EXISTS = new Error(
    '01x0022',
    'The rule already exists',
  );

  static readonly PROJECT_FIRESTORE_RULE_COULD_NOT_CREATE_NEW_RULE = new Error(
    '01x0023',
    'Could not create new rule',
  );
}
