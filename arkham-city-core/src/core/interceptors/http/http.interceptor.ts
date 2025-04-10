import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { HashService } from 'src/core/hash/hash.service';
import { ResponseDto } from 'src/modules/base/base.type';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (this.isFromSDK(request) && this.isProductionMode(request)) {
      const { params, body } = request;
      request.body = HashService.decrypt(body.data, this.getProjectId(request));
    }
    return next.handle().pipe(
      map((data) => {
        const response: ResponseDto = {
          timestamp: new Date(),
          data: data,
          error: false,
          errorCode: undefined,
        };
        return response;
      }),
    );
  }
  private isFromSDK(request: Request): boolean {
    if (request.headers['x-type'] === 'websdk') {
      return true;
    }
    return false;
  }

  private isProductionMode(request: Request): boolean {
    if (request.headers['x-mode'] === 'production') {
      return true;
    }
    return false;
  }

  private getProjectId(request: Request) {
    return request.headers['x-project'];
  }
}
