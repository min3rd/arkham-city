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
  const email:string= 'test@test.com';
  const password:string= 'PasswordIsSecure';
  test('Auth: test register', async () => {
    const user = await firstValueFrom(
      auth().registerByEmailAndPassword(email, password),
    );
    expect(user).toBeDefined();
  });

  test('Auth: test login', async () => {
    const res = await firstValueFrom(auth().logInByEmailAndPassword(email, password));
    expect(res?.accessToken).toBeDefined()
  });
});
