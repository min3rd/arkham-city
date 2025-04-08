import { firstValueFrom } from 'rxjs';
import { arkSDKManager, globalConfig } from '.';

describe('Ark Manager', () => {
  globalConfig({
    url: 'http://localhost:3000',
    version: 'v1',
    projectId: '67ec8b64c5c7b957e287bb15',
    appId: '67f4780637d10200db809dae',
    secretKey:
      'Ar+aCLoWscDcq4NcIZFnpgSbSacgOT5slL9Kp8M8t9i5qrBQhB87BPjLkx+DHah6',
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
