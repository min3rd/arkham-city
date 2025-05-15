import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControlElement } from '../../base/form-control-element/form-control-element.component';

@Component({
  selector: 'ark-checkbox',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ark-checkbox.component.html',
})
export class ArkCheckbox extends FormControlElement {
  @Input() checked: boolean | string = false;

  enableChecked() {
    return (this.checked || this.checked === '') as boolean;
  }
}
