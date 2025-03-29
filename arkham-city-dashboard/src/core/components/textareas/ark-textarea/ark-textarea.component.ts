import { Component, Input, type OnInit } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormControlElement } from '../../base/form-control-element/form-control-element.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ark-textarea',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ark-textarea.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class ArkTextarea extends FormControlElement {
  @Input() rows: string = '3';
}
