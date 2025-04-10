import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from './user.types';
import { firestore } from 'arkham-city-websdk/dist/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _users: BehaviorSubject<User[]> = new BehaviorSubject<any>(null);
  private _user: BehaviorSubject<User> = new BehaviorSubject<any>(null);
  get users$(): Observable<User[]> {
    return this._users.asObservable();
  }
  get user$(): Observable<User> {
    return this._user.asObservable();
  }
  reset() {
    this._user.next(null as any);
  }
  all() {
    return firestore('user')
      .select<any, User[]>({})
      .pipe(
        tap((users) => {
          if (!users) {
            return;
          }
          this._users.next(users);
        }),
      );
  }
  create(user: User): Observable<User | null> {
    return firestore('user').create<User, User>(user);
  }
  get(id: string): Observable<User | null> {
    return firestore('user')
      .get<User>(id)
      .pipe(
        tap((user: User | null) => {
          this._user.next(user as any);
        }),
      );
  }
  update(id: string, user: User) {
    return firestore('user')
      .update<User, User>(id, user)
      .pipe(
        tap((user) => {
          this._user.next(user as any);
        }),
      );
  }

  delete(id: string): Observable<boolean | null> {
    return firestore('user').delete<boolean>(id);
  }
}
