import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ark-tab-content',
  imports: [CommonModule],
  templateUrl: './ark-tab-content.component.html',
})
export class ArkTabContent {
  show = false;

  setShow(value: boolean) {
    this.show = value;
  }
}
