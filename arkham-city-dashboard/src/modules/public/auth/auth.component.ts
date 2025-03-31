import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArkSwitchTheme } from '../../../core/components/buttons/ark-switch-theme/ark-switch-theme.component';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, RouterModule, ArkSwitchTheme],
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {}
