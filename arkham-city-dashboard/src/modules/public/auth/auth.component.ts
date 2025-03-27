import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArkSwitchThemeComponent } from '../../../core/components/buttons/ark-switch-theme/ark-switch-theme.component';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, RouterModule, ArkSwitchThemeComponent],
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  ngOnInit(): void {}
}
