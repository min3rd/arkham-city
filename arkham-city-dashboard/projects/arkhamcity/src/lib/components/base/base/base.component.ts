import { Component, Input } from '@angular/core';

@Component({
  selector: 'base-component',
  imports: [],
  templateUrl: './base.component.html',
})
export class BaseComponent {
  @Input() color: 'teal' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'pink' | 'orange' | 'gray' = 'teal';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() rounded: 'full' | 'lg' | 'md' | 'sm' | 'none' = 'md';
}
