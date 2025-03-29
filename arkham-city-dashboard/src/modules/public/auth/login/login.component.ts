import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BaseComponent } from '../../../../core/components/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArkTextInput } from '../../../../core/components/inputs/ark-text-input/ark-text-input.component';
import { ArkButton } from '../../../../core/components/buttons/ark-button/ark-button.component';
import { ArkCheckbox } from '../../../../core/components/checkboxes/ark-checkbox/ark-checkbox.component';
import { ArkDivider } from '../../../../core/components/dividers/ark-divider/ark-divider.component';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../../../core/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CapitalizePipe } from '../../../../core/pipe/capitalize.pipe';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    RouterModule,
    ArkTextInput,
    ArkButton,
    ArkCheckbox,
    ArkDivider,
    CapitalizePipe,
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends BaseComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  override ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['email@domain.com', [Validators.required, Validators.email]],
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
        if (!response.error) {
          this.router.navigate(['dashboard']);
        }
      });
  }
}
