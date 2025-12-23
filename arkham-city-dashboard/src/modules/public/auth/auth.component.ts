
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ArkSwitchTheme,
} from '../../../../projects/arkhamcity/src/lib/components/buttons/ark-switch-theme/ark-switch-theme.component';

@Component({
  selector: 'app-auth',
  imports: [RouterModule, ArkSwitchTheme],
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
}
