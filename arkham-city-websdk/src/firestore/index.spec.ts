import { firestore } from '.';

describe('Firestore Client', () => {
  test('Firestore Client: firestore(schema)', () => {
    const testSchemaName = 'conversions';
    const returned = firestore(testSchemaName);
    expect(returned).toBeDefined();
    expect(returned.schemaName).toEqual(testSchemaName);
  });
  test('Firestore Client: new', () => {});
});
