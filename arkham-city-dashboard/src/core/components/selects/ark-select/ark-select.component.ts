import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Output,
  TemplateRef,
} from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormControlElement } from '../../base/form-control-element/form-control-element.component';

@Component({
  selector: 'ark-select',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ark-select.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArkSelect extends FormControlElement {
  @ContentChild('options') options!: TemplateRef<any>;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  change(e: Event) {
    this.onChange.emit((e.target as any).value);
  }
}
