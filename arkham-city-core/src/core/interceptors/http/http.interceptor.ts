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
    return request.headers['x-type'] === 'websdk';
  }

  private isProductionMode(request: Request): boolean {
    return request.headers['x-mode'] === 'production';
  }

  private getProjectId(request: Request) {
    return request.headers['x-project'];
  }
}
