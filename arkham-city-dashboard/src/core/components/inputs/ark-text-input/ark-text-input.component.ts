import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  inject,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormElement } from '../../base/form-element/form-element.component';
import { LoadingService } from '../../../services/loading/loading.service';
import { Subject, takeUntil } from 'rxjs';
import { FormControlElement } from '../../base/form-control-element/form-control-element.component';

@Component({
  selector: 'ark-text-input',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ark-text-input.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArkTextInput extends FormControlElement {
  @Input() type!: string;
}
