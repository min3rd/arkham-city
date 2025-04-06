import { firstValueFrom } from "rxjs";
import { arkSDKManager, globalConfig } from ".";

describe("Config Module", () => {
  globalConfig({
    url: "http://localhost:3000",
    version: "v1",
    projectId: "67f27fe312a6cb3e921dbe57",
    appId: "67f27ff412a6cb3e921dbe5c",
    secretKey:
      "vGemdydFtKSa2abATbtXaoMFvmTqd0u5rPv3iFReJQr1VamFTWNgUS+4FaSt+Vtt",
  });
  test("Config Module:endpoint", () => {
    const uri: string = "authenticate";
    const expected: string = `${arkSDKManager.globalConfig.url}/${arkSDKManager.globalConfig.version}/${arkSDKManager.type}/${uri}`;
    const returned = arkSDKManager.endpoint(uri);
    expect(returned).toEqual(expected);
  });
  test("Config Module:authenticate", async () => {
    const res = await firstValueFrom(arkSDKManager.authenticate());
    expect(res).toBeDefined();
  });
});
