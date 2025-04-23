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
  @Input() rounded: 'small' | 'medium' | 'large' | 'full' = 'large';
  @Input() color: 'gray' | 'teal' | 'blue' | 'red' | 'yellow' | 'white' =
    'teal';
  @Input() size: 'default' | 'small' | 'large' = 'default';
  @Input() disabled: boolean | string = false;

  @ContentChild('errors') errors!: TemplateRef<any>;
  invalid = false;

  ngAfterContentInit(): void {
    if (this.formFieldControl) {
      this.formFieldControl.statusChanges.subscribe((status) => {
        this.invalid = status === 'INVALID';
      });
    }
  }

  enableDisabled(): boolean {
    return (this.disabled || this.disabled === '') as boolean;
  }

  getFormControl(): FormControl {
    return this.formFieldControl as FormControl;
  }
}
