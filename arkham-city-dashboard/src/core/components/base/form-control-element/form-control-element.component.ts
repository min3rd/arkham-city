import { AfterContentInit, Component, ContentChild, Input, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormElement } from '../form-element/form-element.component';
import { AbstractControl, ControlContainer, FormControl, FormControlName, FormGroupDirective } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'form-control-element',
  imports: [CommonModule],
  template: ``,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class FormControlElement extends FormElement implements AfterContentInit {
  @Input() formControlName!: string;
  @Input() formControl!: AbstractControl | null;
  @Input() placeholder!: string;
  @Input() value!: string | any;
  @Input() label!: string;
  @Input() rounded: 'small' | 'medium' | 'large' | 'full' = 'large';
  @Input() color: 'gray' | 'teal' | 'blue' | 'red' | 'yellow' | 'white' =
    'teal';
  @Input() size: 'default' | 'small' | 'large' = 'default';
  @Input() disabled: boolean | string = false;

  @ViewChildren(FormControlName)
  _formControls!: QueryList<FormControl>;

  @ContentChild('errors') errors!: TemplateRef<any>;
  invalid = false;

  ngAfterContentInit(): void {
    if (this._formControls) {
      this._formControls.forEach((control) => {
        control.valueChanges.subscribe(() => {
          this.invalid = control.invalid;
        });
      });
    }
  }

  enableDisabled(): boolean {
    return (this.disabled || this.disabled === '') as boolean;
  }

  getFormControl(): FormControl {
    return this.formControl as FormControl;
  }
}
