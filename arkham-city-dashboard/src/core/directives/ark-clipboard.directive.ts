import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[arkClipboard]',
})
export class ArkClipboardDirective {
  @Input() arkClipboard!: string | any;
  @HostListener('click')
  onClick() {
    
  }
}
