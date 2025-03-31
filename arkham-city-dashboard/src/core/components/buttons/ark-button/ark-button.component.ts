import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  type OnInit,
} from '@angular/core';
import { LoadingService } from '../../../services/loading/loading.service';
import { Subject, takeUntil } from 'rxjs';
import { ArkIcon } from '../../icons/ark-icon/ark-icon.component';

@Component({
  selector: 'ark-button',
  imports: [CommonModule, ArkIcon],
  templateUrl: './ark-button.component.html',
})
export class ArkButton implements OnInit {
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
  @Input() ignoreLoading: boolean | string = false;
  @Input() disabled: boolean | string = false;
  @Input() link: boolean | string = false;

  @Output() onClick = new EventEmitter<any>();

  onLoading = false;

  private loadingService: LoadingService = inject(LoadingService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _unsubscribeAll = new Subject<any>();
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
    this.loadingService.show$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((status) => {
        this.onLoading = status;
        this.changeDetectorRef.markForCheck();
      });
  }

  onClickEvent() {
    if (this.disabled || this.onLoading) {
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
  enableIgnoreLoading(): boolean {
    return (this.ignoreLoading || this.ignoreLoading === 'true') as boolean;
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
