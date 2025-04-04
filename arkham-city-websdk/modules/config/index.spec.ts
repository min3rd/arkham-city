import { arkSDKManager, globalConfig } from '.';

describe('Config Module', () => {
  test('Config Module:endpoint', () => {
    const uri: string = 'authenticate';
    globalConfig({
      url: 'http://localhost:3000',
      version: 'v1',
      projectId: 'projectId',
      appId: 'appId',
      secretKey: 'secretKey',
    });
    const expected: string = `${arkSDKManager.globalConfig.url}/${arkSDKManager.globalConfig.version}/${arkSDKManager.type}/${uri}`;
    const returned = arkSDKManager.endpoint(uri);
    expect(returned).toEqual(expected);
  });
});
