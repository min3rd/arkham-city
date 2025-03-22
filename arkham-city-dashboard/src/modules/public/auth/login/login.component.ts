import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '../../../../core/components/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArkTextInputComponent } from '../../../../core/components/inputs/ark-text-input/ark-text-input.component';
import { ArkSwitchThemeComponent } from '../../../../core/components/buttons/ark-switch-theme/ark-switch-theme.component';
import { ArkButtonComponent } from '../../../../core/components/buttons/ark-button/ark-button.component';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ArkTextInputComponent,
    ArkSwitchThemeComponent,
    ArkButtonComponent,
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends BaseComponent {
  override ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  onLogIn() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.changeDetectorRef.markForCheck();
    }, 1000);
  }
}
