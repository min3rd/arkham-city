import { firstValueFrom } from "rxjs";
import { manager, globalConfig } from ".";

describe("Ark Manager", () => {
  globalConfig({
    url: "http://localhost:3000",
    version: "v1",
    projectId: "67f27fe312a6cb3e921dbe57",
    appId: "67f27ff412a6cb3e921dbe5c",
    secretKey:
      "vGemdydFtKSa2abATbtXaoMFvmTqd0u5rPv3iFReJQr1VamFTWNgUS+4FaSt+Vtt",
  });
  test("Ark Manager:endpoint", () => {
    const uri: string = "authenticate";
    const expected: string = `${manager().globalConfig.url}/${
      manager().globalConfig.version
    }/${manager().type}/${uri}`;
    const returned = manager().endpoint(uri);
    expect(returned).toEqual(expected);
  });
  test("Ark Manager:authenticate", async () => {
    const res = await firstValueFrom(manager().authenticate());
    expect(res).toBeDefined();
  });
});
