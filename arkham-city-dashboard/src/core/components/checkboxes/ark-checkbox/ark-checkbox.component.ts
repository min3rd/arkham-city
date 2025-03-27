import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, type OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'ark-checkbox',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ark-checkbox.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class ArkCheckbox implements OnInit {
  @Input() label: string = '';
  @Input() checked: boolean | string = false;
  @Input() controlName!: string;
  @ViewChild(FormControlName)
  formControl!: FormControl;
  ngOnInit(): void {}
  enableChecked() {
    return (this.checked || this.checked === '') as boolean;
  }
}
