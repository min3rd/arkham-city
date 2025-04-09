import { Observable } from 'rxjs';
import { ApiResponse, manager } from '../manager';

export default class FirestoreClient {
  private static _instance: FirestoreClient;
  private _schemaName!: string;
  static instance(schemaName: string): FirestoreClient {
    if (!this._instance) {
      this._instance = new FirestoreClient();
    }
    this._instance._schemaName = schemaName;
    return this._instance;
  }
  get schemaName(): string {
    return this._schemaName;
  }
  create<T, K>(data: T): Observable<ApiResponse<K>> {
    return manager().post<T, K>(`firestore/${this._schemaName}`, data);
  }
  select<T, K>(query: T): Observable<ApiResponse<K>> {
    return manager().post<T, K>(`firestore/${this._schemaName}/query`, query);
  }
}

export const firestore = (schemaName: string) => {
  return FirestoreClient.instance(schemaName);
};
