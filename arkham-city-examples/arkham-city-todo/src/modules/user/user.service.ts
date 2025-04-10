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
  create(user: User) {
    return firestore('user').create(user);
  }
  get(id: string) {
    return firestore('user')
      .select<any, User[]>({
        _id: id,
      })
      .pipe(
        tap((users) => {
          if (!users || !users.length) {
            return;
          }
          this._user.next(users[0]);
        }),
      );
  }
}
