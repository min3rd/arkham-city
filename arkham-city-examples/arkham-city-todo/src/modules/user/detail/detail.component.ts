import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { User } from '../user.types';
@Component({
  selector: 'app-detail',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent implements OnInit, OnDestroy {
  user!: User;
  form!: UntypedFormGroup;
  private formBuilder = inject(UntypedFormBuilder);
  private userService = inject(UserService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private _unsubscribeAll = new Subject<any>();
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
    });

    this.userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user) => {
        this.form.reset();
        if (user) {
          this.user = user;
          this.form.patchValue(user);
          this.changeDetectorRef.markForCheck();
        }
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  create() {
    if (this.form.invalid) {
      return;
    }
    this.userService.create(this.form.getRawValue()).subscribe();
  }
  save() {}
  delete() {}
}
