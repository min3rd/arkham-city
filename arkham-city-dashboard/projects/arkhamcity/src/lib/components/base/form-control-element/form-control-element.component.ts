import { AfterContentInit, Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { FormElement } from '../form-element/form-element.component';
import { AbstractControl, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'form-control-element',
  imports: [CommonModule],
  template: ``,
})
export class FormControlElement extends FormElement implements AfterContentInit {
  @Input() formFieldControl!: AbstractControl | null;
  @Input() placeholder!: string;
  @Input() model!: string | any;
  @Input() label!: string;

  @ContentChild('errors') errors!: TemplateRef<any>;
  invalid = false;

  ngAfterContentInit(): void {
    if (this.formFieldControl) {
      this.formFieldControl.statusChanges.subscribe((status) => {
        this.invalid = status === 'INVALID';
      });
    }
  }

  getFormControl(): FormControl {
    return this.formFieldControl as FormControl;
  }
}
