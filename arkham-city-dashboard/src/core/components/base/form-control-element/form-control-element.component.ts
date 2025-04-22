import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormElement } from '../form-element/form-element.component';
import { AbstractControl, ControlContainer, FormControl, FormControlName, FormGroupDirective } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'form-control-element',
  imports: [CommonModule],
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class FormControlElement extends FormElement implements AfterViewInit {
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

  @ViewChild(FormControlName)
  _formControl!: FormControl;

  @ContentChild('errors') errors!: TemplateRef<any>;
  invalid = false;

  ngAfterViewInit(): void {
    if (this._formControl) {
      this._formControl.statusChanges.subscribe(() => {
        this.invalid = this._formControl.invalid;
        this.changeDetectorRef.markForCheck();
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
