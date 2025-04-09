import { Observable } from 'rxjs';
import { ApiResponse } from '../manager';
export default class FirestoreClient {
    private static _instance;
    private _schemaName;
    static instance(schemaName: string): FirestoreClient;
    get schemaName(): string;
    new<T, K>(data: T): Observable<ApiResponse<K>>;
    select<T, K>(query: T): Observable<ApiResponse<K>>;
}
export declare const firestore: (schemaName: string) => FirestoreClient;
