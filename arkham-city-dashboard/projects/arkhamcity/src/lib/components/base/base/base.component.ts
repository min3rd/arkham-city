import { Component, Input } from '@angular/core';

@Component({
  selector: 'base-component',
  imports: [],
  templateUrl: './base.component.html',
  standalone: true,
})
export class BaseComponent {
  @Input() color: 'teal' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'pink' | 'orange' | 'gray' = 'teal';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() rounded: 'full' | 'lg' | 'md' | 'sm' | 'none' = 'md';
  @Input() disabled: boolean | string = false;
  @Input() ignoreLoading: boolean | string = false;

  enableDisabled() {
    return (this.disabled || this.disabled === '') as boolean;
  }

  enableIgnoreLoading(): boolean {
    return (this.ignoreLoading || this.ignoreLoading === 'true') as boolean;
  }
}
