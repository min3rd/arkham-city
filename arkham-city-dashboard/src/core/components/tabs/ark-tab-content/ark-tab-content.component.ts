import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'ark-tab-content',
  imports: [CommonModule],
  templateUrl: './ark-tab-content.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class ArkTabContent {
  show = false;

  setShow(value: boolean) {
    this.show = value;
  }
}
