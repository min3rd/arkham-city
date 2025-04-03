import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ark-drawer-content',
  exportAs: 'arkDrawerContent',
  imports: [CommonModule],
  templateUrl: './ark-drawer-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArkDrawerContent {}
