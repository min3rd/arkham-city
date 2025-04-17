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
  create<T, K>(data: T): Observable<K | null> {
    return manager().post<T, K>(`firestore/${this._schemaName}`, data);
  }
  select<T, K>(query: T | any = {}): Observable<K | null> {
    return manager().post<T, K>(`firestore/${this._schemaName}/query`, query);
  }
  get<K>(id: string): Observable<K | null> {
    return manager().get<K>(`firestore/${this._schemaName}/${id}`);
  }
  partialUpdate<T, K>(id: string, data: T): Observable<K | null> {
    return manager().patch<T, K>(`firestore/${this._schemaName}/${id}`, data);
  }
  update<T, K>(id: string, data: T): Observable<K | null> {
    return manager().put<T, K>(`firestore/${this._schemaName}/${id}`, data);
  }
  delete<K>(id: string): Observable<K | null> {
    return manager().delete<K>(`firestore/${this._schemaName}/${id}`);
  }
}

export const firestore = (schemaName: string) => {
  return FirestoreClient.instance(schemaName);
};
