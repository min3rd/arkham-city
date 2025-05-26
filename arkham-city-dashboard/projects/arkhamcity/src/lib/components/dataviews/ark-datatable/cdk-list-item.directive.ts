import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[CdkListItem]',
})
export class CdkListItemDirective {
  template = inject(TemplateRef<any>);

  constructor() {
  }

}
