import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BaseComponent } from '../../../../core/components/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArkTextInputComponent } from '../../../../core/components/inputs/ark-text-input/ark-text-input.component';
import { ArkSwitchThemeComponent } from '../../../../core/components/buttons/ark-switch-theme/ark-switch-theme.component';
import { ArkButtonComponent } from '../../../../core/components/buttons/ark-button/ark-button.component';
import { ArkCheckboxComponent } from '../../../../core/components/checkboxes/ark-checkbox/ark-checkbox.component';
import { ArkDividerComponent } from '../../../../core/components/dividers/ark-divider/ark-divider.component';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    ArkTextInputComponent,
    ArkSwitchThemeComponent,
    ArkButtonComponent,
    ArkCheckboxComponent,
    ArkDividerComponent,
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends BaseComponent {
  authService: AuthService = inject(AuthService);
  override ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['email@domain.com', [Validators.required]],
      password: ['ThisIsNewPassword', [Validators.required]],
      rememberMe: [false],
    });
  }
  onLogIn() {
    if (this.form.invalid) {
      return;
    }
    this.authService
      .logInByEmailAndPassword(this.form.getRawValue())
      .subscribe((response) => {
        console.log(response);
      });
  }
}
