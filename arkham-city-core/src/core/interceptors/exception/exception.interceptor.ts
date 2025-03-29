import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((e) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        e['timestamp'] = new Date();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return e;
      }),
    );
  }
}
