import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  DestroyRef,
  EventEmitter,
  forwardRef,
  inject,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  standalone: true,
})
export class ArkSelect extends FormControlElement implements OnInit, OnDestroy {
  @ContentChild('options') options!: TemplateRef<any>;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  selectedValue: any;
  private destroyRef = inject(DestroyRef);

  override ngOnInit() {
    // Initialize selectedValue from model if provided
    if (this.model !== undefined && this.model !== null) {
      this.selectedValue = this.model;
    }

    // Subscribe to form control value changes
    if (this.formFieldControl) {
      this.formFieldControl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(value => {
          this.selectedValue = value;
        });
    }
  }

  change(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.selectedValue = target.value;
    this.onChange.emit(this.selectedValue);
  }

  onBlur(): void {
    // Handle blur event for both FormControl and ngModel versions
    if (this.formFieldControl) {
      this.getFormControl().markAsTouched();
    }
    // Call the touch callback for ControlValueAccessor integration
    this.onTouchedCallback();
  }

  // Implement ControlValueAccessor
  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.selectedValue = value;
      // Update the form control if it exists
      if (this.formFieldControl) {
        this.getFormControl().setValue(value, { emitEvent: false });
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    // Store the callback function to be called when the control is touched
    this.onTouchedCallback = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  override ngOnDestroy(): void {
    // No need to manually unsubscribe as we're using takeUntilDestroyed
    super.ngOnDestroy();
  }

  private onTouchedCallback: () => void = () => {
  };
}
