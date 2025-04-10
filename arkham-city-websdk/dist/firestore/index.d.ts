import { Observable } from 'rxjs';
export default class FirestoreClient {
    private static _instance;
    private _schemaName;
    static instance(schemaName: string): FirestoreClient;
    get schemaName(): string;
    create<T, K>(data: T): Observable<K | null>;
    select<T, K>(query: T): Observable<K | null>;
    get<K>(id: string): Observable<K | null>;
    partialUpdate<T, K>(id: string, data: T): Observable<K | null>;
    update<T, K>(id: string, data: T): Observable<K | null>;
    delete<K>(id: string): Observable<K | null>;
}
export declare const firestore: (schemaName: string) => FirestoreClient;
