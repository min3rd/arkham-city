import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  ArkTextInput,
} from '../../../../../projects/arkhamcity/src/lib/components/inputs/ark-text-input/ark-text-input.component';
import {
  ArkButton,
} from '../../../../../projects/arkhamcity/src/lib/components/buttons/ark-button/ark-button.component';
import {
  ArkCheckbox,
} from '../../../../../projects/arkhamcity/src/lib/components/checkboxes/ark-checkbox/ark-checkbox.component';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';
import { RegisterReqDto } from '../../../../core/auth/auth.type';
import { AuthService } from '../../../../core/auth/auth.service';
import { BaseFormComponent } from '../../../../../projects/arkhamcity/src/lib/components/base/base-form.component';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    RouterModule,
    ArkTextInput,
    ArkButton,
    ArkCheckbox,
  ],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent extends BaseFormComponent implements OnInit {
  private authService: AuthService = inject(AuthService);

  override ngOnInit(): void {
    super.ngOnInit();
    this.form = this.formBuilder.group({
      firstName: ['Arkham City', [Validators.required]],
      lastName: ['Dev', [Validators.required]],
      email: ['email@domain.com', [Validators.required, Validators.email]],
      password: ['ThisIsNewPassword', [Validators.required]],
      confirmPassword: ['ThisIsNewPassword', [Validators.required]],
      agree: [true, [Validators.requiredTrue]],
    });
  }

  register() {
    if (this.form.invalid) {
      return;
    }
    const registerDto: RegisterReqDto = this.form.getRawValue();
    if (registerDto.password != registerDto.confirmPassword) {
      return;
    }
    this.authService
      .registerByEmailAndPassword(
        registerDto.email,
        registerDto.password,
        registerDto.firstName,
        registerDto.lastName,
      )
      .subscribe((res) => {
        this.router.navigate(['/log-in']);
      });
  }
}
