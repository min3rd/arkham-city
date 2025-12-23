import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ArkButton, ArkCheckbox, ArkDivider, ArkTextInput, BaseFormComponent, CapitalizePipe } from 'arkhamcity';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    RouterModule,
    ArkTextInput,
    ArkButton,
    ArkCheckbox,
    ArkDivider,
    CapitalizePipe
],
  templateUrl: './log-in.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogInComponent extends BaseFormComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

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
          if (this.activatedRoute.snapshot.paramMap.get('redirectUrl')) {
            this.router.navigateByUrl(
              this.activatedRoute.snapshot.paramMap.get(
                'redirectUrl',
              ) as string,
            );
            return;
          }
          this.router.navigate(['dashboard']);
        }
      });
  }
}
