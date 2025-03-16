import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ResponseDto } from 'src/modules/base/base.type';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response: ResponseDto = {
          timestamp: new Date(),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: data,
          error: false,
          errorCode: undefined,
        };
        return response;
      }),
    );
  }
}
