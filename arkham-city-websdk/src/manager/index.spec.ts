import { firstValueFrom } from 'rxjs';
import { manager, globalConfig } from '.';

describe('Manager', () => {
  globalConfig({
    url: 'http://localhost:3000',
    version: 'v1',
    projectId: '67f71b0ba9ae99e7aaf82e71',
    appId: '67f71b1fa9ae99e7aaf82e75',
    secretKey:
      'Z315Nvw0CrpQoDpyQvvRvhTQSuo460SfzXU8wmP7LDWitXYEiTZjT4LDH4Wkz8Va',
  });
  test('Manager:endpoint', () => {
    const uri: string = 'authenticate';
    const expected: string = `${manager().globalConfig.url}/${
      manager().globalConfig.version
    }/${manager().type}/${uri}`;
    const returned = manager().endpoint(uri);
    expect(returned).toEqual(expected);
  });
  test('Manager:authenticate', async () => {
    const authenticated = await firstValueFrom(manager().authenticate());
    expect(authenticated).toBeDefined();
  });
});
