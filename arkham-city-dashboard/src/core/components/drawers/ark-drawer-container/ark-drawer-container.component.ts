import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  inject,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ArkDrawerContent } from '../ark-drawer-content/ark-drawer-content.component';
import { ArkDrawer } from '../ark-drawer/ark-drawer.component';

@Component({
  selector: 'ark-drawer-container',
  exportAs: 'arkDrawerContainer',
  imports: [CommonModule, ArkDrawerContent],
  templateUrl: './ark-drawer-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ArkDrawerContainer implements AfterViewInit, OnChanges {
  @ContentChild(ArkDrawer, {
    descendants: true,
  })
  _allDrawers!: QueryList<ArkDrawer>;
  @ContentChild(ArkDrawerContent) _content!: ArkDrawerContent;
  @ViewChild(ArkDrawerContent) _userContent!: ArkDrawerContent;

  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  ngAfterViewInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {}
}
