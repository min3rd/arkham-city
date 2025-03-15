import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  saltOrRounds = 10;
  hash(value: string) {
    return bcrypt.hashSync(value, this.saltOrRounds);
  }
  compare(target: string, hash: string) {
    return bcrypt.compareSync(target, hash);
  }
}
