import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, forwardRef, Input, Output, TemplateRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FormControlElement } from '../../base/form-control-element/form-control-element.component';
import { ClickOutsideDirective } from '../../../directives/click-outside/click-outside.directive';

@Component({
  selector: 'ark-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ClickOutsideDirective],
  templateUrl: './ark-dropdown.component.html',
  styleUrl: './ark-dropdown.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArkDropdownComponent),
      multi: true,
    },
  ],
})
export class ArkDropdownComponent extends FormControlElement {
  @ContentChild('options') options!: TemplateRef<any>;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() multiple = false;
  @Input() searchable = false;

  isOpen = false;
  searchText = '';
  selectedItems: any[] = [];

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  onSearch(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
  }

  selectItem(item: any) {
    if (this.multiple) {
      const index = this.selectedItems.findIndex(i => i.value === item.value);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(item);
      }
    } else {
      this.selectedItems = [item];
      this.closeDropdown();
    }
    this.onChange.emit(this.multiple ? this.selectedItems : this.selectedItems[0]);
  }

  isSelected(item: any): boolean {
    return this.selectedItems.some(i => i.value === item.value);
  }

  clearSelection() {
    this.selectedItems = [];
    this.onChange.emit(this.multiple ? [] : null);
  }

  // Implement ControlValueAccessor
  writeValue(value: any): void {
    if (value === null || value === undefined) {
      this.selectedItems = [];
    } else if (this.multiple && Array.isArray(value)) {
      this.selectedItems = value;
    } else {
      this.selectedItems = [value];
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
}
