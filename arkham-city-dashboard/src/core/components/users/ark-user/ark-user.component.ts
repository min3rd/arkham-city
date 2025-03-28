import {
  ChangeDetectionStrategy,
  Component,
  Input,
  type OnInit,
} from '@angular/core';
import { User } from '../../../auth/auth.type';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ark-user',
  imports: [CommonModule, TranslocoModule, RouterModule],
  templateUrl: './ark-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArkUser implements OnInit {
  @Input() user!: User | null;
  @Input() rounded: 'full' | 'large' | 'medium' | 'small' | 'none' = 'none';
  ngOnInit(): void {}
}
