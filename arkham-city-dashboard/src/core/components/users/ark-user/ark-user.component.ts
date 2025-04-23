import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserResDto } from '../../../auth/auth.type';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../base/base/base.component';

@Component({
  selector: 'ark-user',
  imports: [CommonModule, TranslocoModule, RouterModule],
  templateUrl: './ark-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArkUser extends BaseComponent {
  @Input() user!: UserResDto | null | undefined;
}
