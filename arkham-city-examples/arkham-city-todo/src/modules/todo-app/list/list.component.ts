import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Task } from '../task.types';
import { TaskService } from '../task.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-list',
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit, OnDestroy {
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
