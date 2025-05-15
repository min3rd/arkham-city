import { Component, Input } from '@angular/core';

@Component({
  selector: 'ark-divider',
  imports: [],
  templateUrl: './ark-divider.component.html',
})
export class ArkDivider {
  @Input() label!: string;
}
