import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  EventEmitter,
  forwardRef,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FormControlElement } from '../../base/form-control-element/form-control-element.component';
import { Subject, takeUntil } from 'rxjs';

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
export class ArkSelect extends FormControlElement implements OnInit, OnDestroy {
  @ContentChild('options') options!: TemplateRef<any>;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  selectedValue: any;
  private unsubscribe$ = new Subject<void>();

  override ngOnInit() {
    // Initialize selectedValue from model if provided
    if (this.model !== undefined && this.model !== null) {
      this.selectedValue = this.model;
    }

    // Subscribe to form control value changes
    if (this.formFieldControl) {
      this.formFieldControl.valueChanges
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(value => {
          this.selectedValue = value;
        });
    }
  }

  change(e: Event) {
    this.selectedValue = (e.target as any).value;
    this.onChange.emit(this.selectedValue);
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
    // Not implemented
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  override ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    super.ngOnDestroy();
  }
}
