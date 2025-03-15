import { MicroserviceErrorCode } from './microservice.type';

const ErrorMessage = {};
ErrorMessage[MicroserviceErrorCode.DEFAULT] = 'unknow error';
ErrorMessage[MicroserviceErrorCode.DUPLICATE_EMAIL] =
  'can not register because email already registerd';
export default ErrorMessage;
