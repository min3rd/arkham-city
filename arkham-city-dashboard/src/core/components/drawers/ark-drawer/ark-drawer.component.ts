import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';

@Component({
  selector: 'ark-drawer',
  exportAs: 'arkDrawer',
  imports: [CommonModule],
  templateUrl: './ark-drawer.component.html',
})
export class ArkDrawer {
  @Input() position: 'start' | 'end' = 'start';
  opened = false;
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  open() {
    this.opened = true;
    this.changeDetectorRef.markForCheck();
  }

  close() {
    this.opened = false;
    this.changeDetectorRef.markForCheck();
  }
}
