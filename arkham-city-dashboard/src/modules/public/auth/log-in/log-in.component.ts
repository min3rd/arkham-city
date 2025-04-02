import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { BaseComponent } from '../../../../core/components/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArkTextInput } from '../../../../core/components/inputs/ark-text-input/ark-text-input.component';
import { ArkButton } from '../../../../core/components/buttons/ark-button/ark-button.component';
import { ArkCheckbox } from '../../../../core/components/checkboxes/ark-checkbox/ark-checkbox.component';
import { ArkDivider } from '../../../../core/components/dividers/ark-divider/ark-divider.component';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../../../core/auth/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  templateUrl: './log-in.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogInComponent extends BaseComponent implements OnInit {
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
