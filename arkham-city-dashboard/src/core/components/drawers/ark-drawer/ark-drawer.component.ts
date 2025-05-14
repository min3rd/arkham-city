import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'ark-drawer',
  exportAs: 'arkDrawer',
  imports: [CommonModule],
  templateUrl: './ark-drawer.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ArkDrawer implements OnChanges {
  @Input() position: 'start' | 'end' = 'start';
  @Input() opened = false;
  @Input() mode: 'side' | 'over' = 'side';

  @Output() modeChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() openedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() positionChanged: EventEmitter<string> = new EventEmitter<string>();

  _overlay!: HTMLElement;

  private readonly _elementRef = inject(ElementRef);
  private readonly _render2 = inject(Renderer2);

  @HostBinding('class') get classList(): any {
    return {};
  }

  @HostBinding('style') get styleList(): any {
    return {
      visibility: this.opened ? 'visible' : 'hidden',
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('opened' in changes) {
      const currentOpened = changes['opened'].currentValue;
      this._toggleOpened(currentOpened);
      this.openedChanged.next(currentOpened);
    }

    if ('mode' in changes) {
      const previousMode = changes['mode'].previousValue;
      const currentMode = changes['mode'].currentValue;
      if (previousMode == 'over' && currentMode == 'side') {
        this._hideOverlay();
      }
      this.modeChanged.next(currentMode);
    }
  }

  open() {
    if (this.opened) return;
    this._toggleOpened(true);
  }

  close() {
    this.opened = false;
    this._toggleOpened(false);
  }

  toggle() {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  _showOverlay() {

  }

  _hideOverlay() {

  }

  _toggleOpened(value: boolean) {
    this.opened = value;
    if (this.mode == 'over') {
      if (this.opened) {
        this._showOverlay();
      } else {
        this._hideOverlay();
      }
    }

    this.openedChanged.next(value);
  }
}
