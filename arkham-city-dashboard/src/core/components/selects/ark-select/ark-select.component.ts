import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { FormControlElement } from '../../base/form-control-element/form-control-element.component';

@Component({
  selector: 'ark-select',
  imports: [CommonModule],
  templateUrl: './ark-select.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class ArkSelect extends FormControlElement {
  @Input() items!: any[];
}
