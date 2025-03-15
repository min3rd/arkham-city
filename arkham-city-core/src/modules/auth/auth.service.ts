import { Inject, Injectable } from '@nestjs/common';
import { ClientRedis, EventPattern } from '@nestjs/microservices';
import { microserviceConfig } from 'src/config/microservice.config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(microserviceConfig.auth.name) private readonly client: ClientRedis,
  ) {}

  @EventPattern('test')
  test() {
    console.log('here');

    return 'hello world';
  }
}
