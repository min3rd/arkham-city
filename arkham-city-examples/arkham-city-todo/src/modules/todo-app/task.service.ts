import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Task } from './task.types';
import { firestore } from 'arkham-city-websdk/dist/firestore';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _tasks: BehaviorSubject<Task[]> = new BehaviorSubject<any>(null);
  private _task: BehaviorSubject<Task> = new BehaviorSubject<any>(null);
  get tasks$(): Observable<Task[]> {
    return this._tasks.asObservable();
  }
  get task$(): Observable<Task> {
    return this._task.asObservable();
  }

  reset() {
    this._task.next(null as any);
  }
  all() {
    return firestore('task')
      .select<any, Task[]>({})
      .pipe(
        tap((tasks) => {
          if (!tasks) {
            return;
          }
          this._tasks.next(tasks);
        }),
      );
  }
  create(task: Task): Observable<Task | null> {
    return firestore('task').create<Task, Task>(task);
  }
  get(id: string): Observable<Task | null> {
    return firestore('task')
      .get<Task>(id)
      .pipe(
        tap((task: Task | null) => {
          this._task.next(task as any);
        }),
      );
  }
  update(id: string, task: Task) {
    return firestore('task')
      .update<Task, Task>(id, task)
      .pipe(
        tap((task) => {
          this._task.next(task as any);
        }),
      );
  }

  delete(id: string): Observable<boolean | null> {
    return firestore('task').delete<boolean>(id);
  }
}
