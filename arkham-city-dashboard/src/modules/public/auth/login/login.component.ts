import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '../../../../core/components/base/base.component';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends BaseComponent {}
