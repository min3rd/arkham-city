import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ark-drawer-content',
  exportAs: 'arkDrawerContent',
  templateUrl: './ark-drawer-content.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule],
})
export class ArkDrawerContent {
  @Input() opened = false;
  @Input() mode: 'side' | 'over' = 'side';
}
