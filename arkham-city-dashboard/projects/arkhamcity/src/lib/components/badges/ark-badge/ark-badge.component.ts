import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../base/base/base.component';

@Component({
  selector: 'ark-badge',
  imports: [CommonModule],
  templateUrl: './ark-badge.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class ArkBadge extends BaseComponent {

}
