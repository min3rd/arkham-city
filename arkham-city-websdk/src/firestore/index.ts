import { Observable } from 'rxjs';
import { ApiResponse, arkSDKManager } from '../ark-manager';

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
  new<T, K>(data: T): Observable<ApiResponse<K>> {
    return arkSDKManager().post<T, K>(`firestore/${this._schemaName}`, data);
  }
  select<T>(): Observable<ApiResponse<T>> {
    return arkSDKManager().get<T>(`firestore/${this._schemaName}`);
  }
}

export const firestore = (schemaName: string) => {
  return FirestoreClient.instance(schemaName);
};
