import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ark-tab-content',
  templateUrl: './ark-tab-content.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class ArkTabContent {
  @Input() show = true;

  @HostBinding('style') get styleList(): { visibility: string } {
    return {
      visibility: this.show ? 'visible' : 'hidden',
    };
  }

  setShow(value: boolean): void {
    this.show = value;
  }
}
