import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { firestore } from 'arkham-city-websdk/dist/firestore';
import { Subject } from 'rxjs';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-todo-app',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: './todo-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoAppComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject();
  ngOnInit(): void {
    firestore('task')
      .select({})
      .subscribe((res) => {
        console.log(res);
      });
  }
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
  newUser() {
    firestore('user')
      .create({
        name: 'User',
      })
      .subscribe((res) => {
        console.log(res);
      });
  }
}
