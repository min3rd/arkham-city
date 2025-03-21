import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
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
})
export class ArkTextInputComponent implements AfterViewInit {
  @Input() type!: string;
  @Input() placeholder!: string;
  @Input() value!: string;
  @Input() label!: string;
  @Input() controlName!: string;

  @Input() rounded: 'xs' | 'md' | 'lg' | 'full' = 'lg';
  @Input() color: 'gray' | 'teal' | 'blue' | 'red' | 'yellow' | 'white' =
    'teal';
  @Input() size: 'default' | 'small' | 'large' = 'default';

  @ViewChild(FormControlName)
  public formControl!: FormControl;

  invalid: boolean = false;
  required: boolean = false;
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  ngAfterViewInit(): void {
    if (this.formControl) {
      this.formControl.statusChanges.subscribe(() => {
        this.invalid = false;
        if (this.formControl.invalid) {
          this.invalid = true;
          for (const error of Object.keys(this.formControl.errors as any)) {
            console.log(error);
          }
        }
        this.changeDetectorRef.markForCheck();
      });
    }
  }
}
