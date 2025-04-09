import { firstValueFrom } from 'rxjs';
import { firestore } from '.';
import { globalConfig } from '../ark-manager';

describe('Firestore Client', () => {
  globalConfig({
    url: 'http://localhost:3000',
    version: 'v1',
    projectId: '67f5c8217c6825c085fbbeef',
    appId: '67f5c8337c6825c085fbbef3',
    secretKey:
      'VpkrHWRgqtwU51W3K2NGa3yKp4kjbpRzcE3hdxIat1YhbzE3eeR4lI71ETDW8Z9L',
  });
  test('Firestore Client: firestore(schema)', () => {
    const testSchemaName = 'conversions';
    const returned = firestore(testSchemaName);
    expect(returned).toBeDefined();
    expect(returned.schemaName).toEqual(testSchemaName);
  });
  test('Firestore Client: new', async () => {
    const payload = {
      filed1: 'This is field 1',
      children: [
        {
          name: 'Daughter',
        },
        {
          name: 'Son',
        },
      ],
      account: {
        name: 'Account name',
        email: 'email@email.com',
        balances: {
          real: 50000,
          demo: 10000000,
        },
      },
    };
    const response = await firstValueFrom(firestore('test').new(payload));
    expect(response).toBeDefined();
  });

  test('Firestore Client: update dynamic schema', async () => {
    const payload = {
      field2: 'This is field2',
      emails: ['email0@email.com', 'email1@email.com'],
      data: {
        accounts: [
          {
            username: 'account1',
          },
          {
            username: 'account2',
          },
        ],
      },
    };
    const response = await firstValueFrom(firestore('test').new(payload));
    expect(response).toBeDefined();
  });

  test('Firestore Client: query all schema', async () => {
    const response = await firstValueFrom(firestore('test').select({}));
    expect(response).toBeDefined();
  });

  test('Firestore Client: query schema', async () => {
    const random = Math.random();
    const payload = {
      key: `This is the key ${random}`,
    };
    const newResponse = await firstValueFrom(
      firestore('test').new<any, any>(payload),
    );
    expect(newResponse.data).toBeDefined();
    const response = await firstValueFrom(
      firestore('test').select<any, any>({
        _id: newResponse?.data?._id,
      }),
    );
    console.log(response.data);
    expect(response.data).toBeDefined();
    expect(response.data.length).toBeGreaterThan(0);
  });
});
