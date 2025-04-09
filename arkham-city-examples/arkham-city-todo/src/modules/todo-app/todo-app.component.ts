import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { firestore } from 'arkham-city-websdk/dist/firestore';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-todo-app',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './todo-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoAppComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject();
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  newTask() {
    firestore('task')
      .create({
        name: 'Task',
        due: new Date(),
      })
      .subscribe((res) => {
        console.log(res);
      });
  }
}
