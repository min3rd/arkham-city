import { firstValueFrom } from 'rxjs';
import { arkSDKManager, globalConfig } from '.';

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
    const expected: string = `${arkSDKManager().globalConfig.url}/${
      arkSDKManager().globalConfig.version
    }/${arkSDKManager().type}/${uri}`;
    const returned = arkSDKManager().endpoint(uri);
    expect(returned).toEqual(expected);
  });
  test('Ark Manager:authenticate', async () => {
    const res = await firstValueFrom(arkSDKManager().authenticate());
    expect(res).toBeDefined();
  });
  test('Ark Manager:post check', async () => {
    const payload = {
      data: 'This is data',
    };
    const res = await firstValueFrom(
      arkSDKManager().post(`auth/test`, payload),
    );
    expect(res).toBeDefined();
    const data = res?.data;
    expect(data).toEqual(payload);
  });
});
