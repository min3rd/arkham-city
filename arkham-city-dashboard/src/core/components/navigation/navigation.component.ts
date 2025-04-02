import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NavigationItem } from './navigation.type';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { ArkNavigationBasicItem } from './basic-item/basic-item.component';
import { ArkNavigationGroupItem } from './group-item/group-item.component';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'ark-navigation-sidebar',
  imports: [
    CommonModule,
    TranslocoModule,
    NgIcon,
    ArkNavigationBasicItem,
    ArkNavigationGroupItem,
  ],
  templateUrl: './navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArkNavigation implements OnChanges {
  @Input() items: NavigationItem[] = [];
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }
}
