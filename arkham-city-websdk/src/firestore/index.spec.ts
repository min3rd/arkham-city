import { firstValueFrom } from 'rxjs';
import { firestore } from '.';
import { globalConfig } from '../manager';

describe('Firestore Client', () => {
  globalConfig({
    url: 'http://localhost:3000',
    version: 'v1',
    projectId: '68075da4ccae85f2016da2b5',
    appId: '680af9adf25bf1f7cd9d936f',
    secretKey:
      'KFf/uq8Dl1VwNVABxgJyjM2I14OpItM9jIPQe8XnESZ+IAAZJQa/LFYUP2rTHO5z',
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
    const record = await firstValueFrom(firestore('test').create(payload));
    expect(record).toBeDefined();
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
    const test = await firstValueFrom(firestore('test').create(payload));
    expect(test).toBeDefined();
  });

  test('Firestore Client: query all schema', async () => {
    const records = await firstValueFrom(firestore('test').select());
    expect(records).toBeDefined();
  });

  test('Firestore Client: query schema', async () => {
    const random = Math.random();
    const payload = {
      key: `This is the key ${random}`,
    };
    const newRecord = await firstValueFrom(
      firestore('test').create<any, any>(payload),
    );
    expect(newRecord).toBeDefined();
    const records = await firstValueFrom(
      firestore('test').select<any, any>({
        _id: newRecord?._id,
      }),
    );
    expect(records).toBeDefined();
    expect(records.length).toBeGreaterThan(0);
  });
});
