import { firstValueFrom } from 'rxjs';
import { firestore } from '.';
import { globalConfig } from '../ark-manager';

describe('Firestore Client', () => {
  globalConfig({
    url: 'http://localhost:3000',
    version: 'v1',
    projectId: '67ec8b64c5c7b957e287bb15',
    appId: '67f4780637d10200db809dae',
    secretKey:
      'Ar+aCLoWscDcq4NcIZFnpgSbSacgOT5slL9Kp8M8t9i5qrBQhB87BPjLkx+DHah6',
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
    };
    const response = await firstValueFrom(firestore('test').new(payload));
    expect(response).toBeDefined();
  });
});
