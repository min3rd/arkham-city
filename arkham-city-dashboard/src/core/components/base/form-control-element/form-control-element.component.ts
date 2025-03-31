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
import {
  ControlContainer,
  FormControl,
  FormControlName,
  FormGroupDirective,
} from '@angular/forms';

@Component({
  selector: 'form-control-element',
  imports: [],
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
  @Input() controlName!: string;
  @Input() placeholder!: string;
  @Input() value!: string;
  @Input() label!: string;
  @Input() rounded: 'small' | 'medium' | 'large' | 'full' = 'large';
  @Input() color: 'gray' | 'teal' | 'blue' | 'red' | 'yellow' | 'white' =
    'teal';
  @Input() size: 'default' | 'small' | 'large' = 'default';

  @ViewChild(FormControlName)
  formControl!: FormControl;
  @ContentChild('errors') errors!: TemplateRef<any>;
  invalid = false;
  ngAfterViewInit(): void {
    if (this.formControl) {
      this.formControl.statusChanges.subscribe(() => {
        this.invalid = false;
        if (this.formControl.invalid) {
          this.invalid = true;
        }
        this.changeDetectorRef.markForCheck();
      });
    }
  }
}
