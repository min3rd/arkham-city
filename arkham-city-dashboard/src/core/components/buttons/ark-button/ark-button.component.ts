import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  type OnInit,
} from '@angular/core';

@Component({
  selector: 'ark-button',
  imports: [CommonModule],
  templateUrl: './ark-button.component.html',
})
export class ArkButtonComponent implements OnInit {
  @Input() label!: string;
  @Input() rounded: 'xs' | 'md' | 'lg' | 'full' = 'lg';
  @Input() color: 'gray' | 'teal' | 'blue' | 'red' | 'yellow' | 'white' =
    'teal';
  @Input() size: 'default' | 'small' | 'large' = 'default';
  @Input() solid: boolean | string = false;
  @Input() outline: boolean | string = false;
  @Input() ghost: boolean | string = false;
  @Input() soft: boolean | string = false;
  @Input() icon!: string;
  @Input() loading: boolean | string = false;
  @Input() disabled: boolean | string = false;
  @Input() link: boolean | string = false;

  @Output() onClick: EventEmitter<any> = new EventEmitter();
  ngOnInit(): void {
    if (
      !this.isSolid() &&
      !this.isOutline() &&
      !this.isGhost() &&
      !this.isSoft() &&
      !this.isLink()
    ) {
      this.solid = true;
    }
  }

  onClickEvent() {
    if (this.disabled || this.loading) {
      return;
    }
    this.onClick.emit('click');
  }
  enableSolid(): boolean {
    return (this.solid || this.solid === '') as boolean;
  }
  enableOutline(): boolean {
    return (this.outline || this.outline === '') as boolean;
  }
  enableGhost(): boolean {
    return (this.ghost || this.ghost === '') as boolean;
  }
  enableSoft(): boolean {
    return (this.soft || this.soft === '') as boolean;
  }
  enableLoading(): boolean {
    return (this.loading || this.loading === '') as boolean;
  }
  enableDisabled() {
    return (this.disabled || this.disabled === '') as boolean;
  }
  enableLink() {
    return (this.link || this.link === '') as boolean;
  }

  isSolid(): boolean {
    return (
      this.enableSolid() &&
      !this.enableOutline() &&
      !this.enableGhost() &&
      !this.enableSoft() &&
      !this.enableLink()
    );
  }
  isOutline(): boolean {
    return (
      this.enableOutline() &&
      !this.enableSolid() &&
      !this.enableGhost() &&
      !this.enableSoft() &&
      !this.enableLink()
    );
  }
  isGhost(): boolean {
    return (
      this.enableGhost() &&
      !this.enableSolid() &&
      !this.enableOutline() &&
      !this.enableSoft() &&
      !this.enableLink()
    );
  }
  isSoft(): boolean {
    return (
      this.enableSoft() &&
      !this.enableSolid() &&
      !this.enableOutline() &&
      !this.enableGhost() &&
      !this.enableLink()
    );
  }
  isLink(): boolean {
    return (
      this.enableLink() &&
      !this.enableSolid() &&
      !this.enableGhost() &&
      !this.enableOutline() &&
      !this.enableSoft()
    );
  }
}
