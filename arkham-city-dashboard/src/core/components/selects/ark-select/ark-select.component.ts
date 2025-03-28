import { CommonModule } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'ark-select',
  imports: [CommonModule],
  templateUrl: './ark-select.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class ArkSelect implements OnInit {
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() items!: any[];
  @Input() rounded: 'xs' | 'md' | 'lg' | 'full' = 'lg';
  @Input() color: 'gray' | 'teal' | 'blue' | 'red' | 'yellow' | 'white' =
    'teal';
  @Input() size: 'default' | 'small' | 'large' = 'default';
  invalid: boolean = false;
  ngOnInit(): void {}
}
