import { Observable } from 'rxjs';
import { arkSDKManager, ArkSDKManager } from '../config';
import HttpClient from '../httpClient';
import { AxiosResponse } from 'axios';

export default class FirestoreClient {
  private static _instance: FirestoreClient;
  private _arkSDKManager: ArkSDKManager = arkSDKManager;
  private _httpClient: HttpClient = new HttpClient();
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
  new<T, K>(data: T): Observable<AxiosResponse<K | any>> {
    if(!this._arkSDKManager.accessToken){
        
    }
    return this._httpClient.post(
      this._arkSDKManager.endpoint(`/firestore/${this._schemaName}`),
      data,
    );
  }
}

export const firestore = (schemaName: string) => {
  return FirestoreClient.instance(schemaName);
};
