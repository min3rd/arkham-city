import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, forwardRef, Output, TemplateRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FormControlElement } from '../../base/form-control-element/form-control-element.component';

@Component({
  selector: 'ark-select',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ark-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArkSelect),
      multi: true,
    },
  ],
})
export class ArkSelect extends FormControlElement {
  @ContentChild('options') options!: TemplateRef<any>;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  change(e: Event) {
    this.onChange.emit((e.target as any).value);
  }
}
