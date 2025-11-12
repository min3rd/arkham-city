import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ControlValueAccessor,
} from '@angular/forms';
import { FormControlElement } from '../../base/form-control-element/form-control-element.component';

@Component({
  selector: 'ark-text-input',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ark-text-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArkTextInput),
      multi: true,
    },
  ],
})
export class ArkTextInput extends FormControlElement implements ControlValueAccessor {
  @Input() type: string = 'text';

  // ControlValueAccessor callbacks
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  // When used with formControlName (i.e. CVA path) we rely on model as the value container
  writeValue(obj: any): void {
    this.model = obj;
    // Trigger change detection if needed
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Base component already derives disabled state from loading; we can store a flag
    // This method is optional for now; template uses enableDisabled()
    // If a dedicated disabled input is added later, wire it here.
  }

  // Called when internal ngModel (CVA usage branch) changes
  onInternalModelChange(value: any) {
    this.onChange(value);
  }

  onInternalBlur() {
    this.onTouched();
  }
}
