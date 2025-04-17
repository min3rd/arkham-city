import { firstValueFrom } from 'rxjs';
import { globalConfig } from '../manager';
import { auth } from '.';
describe('Auth', () => {
  globalConfig({
    url: 'http://localhost:3000',
    version: 'v1',
    projectId: '67f71b0ba9ae99e7aaf82e71',
    appId: '67f71b1fa9ae99e7aaf82e75',
    secretKey:
      'Z315Nvw0CrpQoDpyQvvRvhTQSuo460SfzXU8wmP7LDWitXYEiTZjT4LDH4Wkz8Va',
  });
  test('Auth: test register', async () => {
    const user = await firstValueFrom(
      auth().registerByEmailAndPassword('test@test.com', 'PasswordIsSecure'),
    );
    expect(user).toBeDefined();
  });
});
