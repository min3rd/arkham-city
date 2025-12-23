import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from './user.types';
import { firestore } from 'arkham-city-websdk/dist/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _users = new BehaviorSubject<User[] | null>(null);
  private _user = new BehaviorSubject<User | null>(null);
  get users$(): Observable<User[] | null> {
    return this._users.asObservable();
  }
  get user$(): Observable<User | null> {
    return this._user.asObservable();
  }
  reset() {
    this._user.next(null);
  }
  all() {
    return firestore('user')
      .select<any, User[]>({})
      .pipe(
        tap((users: User[] | null) => {
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
          this._user.next(user);
        }),
      );
  }
  update(id: string, user: User) {
    return firestore('user')
      .update<User, User>(id, user)
      .pipe(
        tap((user: User | null) => {
          this._user.next(user);
        }),
      );
  }

  delete(id: string): Observable<boolean | null> {
    return firestore('user').delete<boolean>(id);
  }
}
