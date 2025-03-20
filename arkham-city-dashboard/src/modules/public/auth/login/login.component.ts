import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '../../../../core/components/base/base.component';
import { TextInputComponent } from '../../../../core/components/inputs/text-input/text-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TextInputComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends BaseComponent {
  override ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['email@email.com', [Validators.required]],
      password: ['ThisIsNewPassword', [Validators.required]],
    });
  }
}
