import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnInit,
} from '@angular/core';
import { BaseComponent } from '../../../../core/components/base/base.component';
import { ArkTextInput } from '../../../../core/components/inputs/ark-text-input/ark-text-input.component';
import { ArkButton } from '../../../../core/components/buttons/ark-button/ark-button.component';
import { ArkCheckbox } from '../../../../core/components/checkboxes/ark-checkbox/ark-checkbox.component';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';
import { RegisterReqDto } from '../../../../core/auth/auth.type';
import { AuthService } from '../../../../core/auth/auth.service';

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
export class RegisterComponent extends BaseComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  override ngOnInit(): void {
    super.ngOnInit();
    this.form = this.formBuilder.group({
      firstNane: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      agree: [false, [Validators.requiredTrue]],
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
        registerDto.lastName
      )
      .subscribe((res) => {
        this.router.navigate(['/log-in'])
      });
  }
}
