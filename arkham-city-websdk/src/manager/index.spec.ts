import { firstValueFrom } from 'rxjs';
import { manager, globalConfig } from '.';

describe('Ark Manager', () => {
  globalConfig({
    url: 'http://localhost:3000',
    version: 'v1',
    projectId: '67f5c8217c6825c085fbbeef',
    appId: '67f5c8337c6825c085fbbef3',
    secretKey:
      'VpkrHWRgqtwU51W3K2NGa3yKp4kjbpRzcE3hdxIat1YhbzE3eeR4lI71ETDW8Z9L',
  });
  test('Ark Manager:endpoint', () => {
    const uri: string = 'authenticate';
    const expected: string = `${manager().globalConfig.url}/${
      manager().globalConfig.version
    }/${manager().type}/${uri}`;
    const returned = manager().endpoint(uri);
    expect(returned).toEqual(expected);
  });
  test('Ark Manager:authenticate', async () => {
    const res = await firstValueFrom(manager().authenticate());
    expect(res).toBeDefined();
  });
});
