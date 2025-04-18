import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subject, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Task } from './task.types';
import { TaskService } from './task.service';
@Component({
  selector: 'app-todo-app',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
  ],
  templateUrl: './todo-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoAppComponent implements OnInit, OnDestroy {
  tasks!: Task[];
  private taskService = inject(TaskService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private _unsubscribeAll: Subject<any> = new Subject();
  ngOnInit(): void {
    this.taskService.tasks$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((tasks) => {
        this.tasks = tasks;
        this.changeDetectorRef.markForCheck();
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
