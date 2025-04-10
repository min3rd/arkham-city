import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Status, Task } from '../task.types';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TaskService } from '../task.service';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../user/user.types';
import { UserService } from '../../user/user.service';

export const StatusSelects = [
  {
    name: 'New',
    value: Status.new,
  },
  {
    name: 'In-progress',
    value: Status.inProgress,
  },
  {
    name: 'Cancelled',
    value: Status.cancelled,
  },
  {
    name: 'Resolved',
    value: Status.resolved,
  },
];

@Component({
  selector: 'app-detail',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent implements OnInit, OnDestroy {
  statuses = StatusSelects;
  task!: Task;
  users!: User[];
  form!: UntypedFormGroup;
  private formBuilder = inject(UntypedFormBuilder);
  private taskService = inject(TaskService);
  private userService = inject(UserService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private router = inject(Router);
  private _unsubscribeAll = new Subject<any>();
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: [''],
      status: [''],
      assignee: [''],
    });

    this.userService.users$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((users) => {
        this.users = users;
        this.changeDetectorRef.markForCheck();
      });
  }
  ngOnDestroy(): void {}
  create() {}
  update() {}
  delete() {}
}
