
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subject, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Task } from './task.types';
import { TaskService } from './task.service';
import { firestore } from 'arkham-city-websdk/dist/firestore';

@Component({
  selector: 'app-todo-app',
  imports: [
    RouterModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule
],
  templateUrl: './todo-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoAppComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  private readonly alphabet = 'abcdefghijklmnopqrstuvwxyz';
  private taskService = inject(TaskService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private _unsubscribeAll: Subject<any> = new Subject();

  ngOnInit(): void {
    this.taskService.tasks$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((tasks: Task[] | null) => {
        this.tasks = tasks ?? [];
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  randomData() {
    firestore(this.randomCollectionName(Math.random() * 10 + 1)).create(this.randomObject()).subscribe();
  }

  randomCollectionName(length: number): string {
    return this.alphabet.split('').sort(() => 0.5 - Math.random()).slice(0, length).join('');
  }

  randomObject() {
    const obj: any = {};
    for (let i = 0; i < 10; i++) {
      const key = this.randomCollectionName(Math.random() * 10 + 1);
      obj[key] = this.randomCollectionName(Math.random() * 10 + 1);
    }
    return obj;
  }
}
