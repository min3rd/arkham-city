import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../user.service';
import { User } from '../user.types';
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
  users!: User[];
  private userService = inject(UserService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private _ubsubscribeAll = new Subject<any>();
  ngOnInit(): void {
    this.userService.users$
      .pipe(takeUntil(this._ubsubscribeAll))
      .subscribe((users) => {
        this.users = users;
        this.changeDetectorRef.markForCheck();
      });
  }
  ngOnDestroy(): void {
    this._ubsubscribeAll.next(null);
    this._ubsubscribeAll.complete();
  }
}
