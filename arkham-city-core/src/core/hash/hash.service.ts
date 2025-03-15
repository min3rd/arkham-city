import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  saltOrRounds = 10;
  hash(value: any) {
    return bcrypt.hashSync(JSON.stringify(value), this.saltOrRounds);
  }
  compare(target: string, source: string) {
    return bcrypt.compareSync(target, source);
  }
}
