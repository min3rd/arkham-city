import { Component, HostBinding, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ark-tab-content',
  templateUrl: './ark-tab-content.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class ArkTabContent implements OnChanges {
  @Input() show = true;

  @HostBinding('style') get styleList(): any {
    return {
      visibility: this.show ? 'visible' : 'hidden',
    };
  }

  setShow(value: boolean) {
    this.show = value;
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('show' in changes) {
      const currentShow = changes['show'].currentValue;
      this.setShow(currentShow);
    }
  }

}
