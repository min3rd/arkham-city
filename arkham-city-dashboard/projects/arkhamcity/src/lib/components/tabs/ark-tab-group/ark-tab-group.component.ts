import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArkIcon } from '../../icons/ark-icon/ark-icon.component';
import { ArkTabContent } from '../ark-tab-content/ark-tab-content.component';
import { BaseComponent } from '../../base/base/base.component';

export interface ArkTabTitle {
  id: string;
  title: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'ark-tab-group',
  imports: [CommonModule, ArkIcon],
  templateUrl: './ark-tab-group.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class ArkTabGroup extends BaseComponent implements AfterContentInit {
  @Input() titles!: ArkTabTitle[];
  @Output() tabChange = new EventEmitter<number>();
  @ContentChildren(ArkTabContent) tabs!: QueryList<ArkTabContent>;
  selectedIndex = 0;

  @Input() set activeIndex(index: number) {
    if (index !== this.selectedIndex && index >= 0) {
      this.change(index);
    }
  }

  ngAfterContentInit(): void {
    // Initialize tabs
    this.updateTabVisibility();

    // Listen for changes to the tabs collection
    this.tabs.changes.subscribe(() => {
      this.updateTabVisibility();
    });
  }

  change(index: number): void {
    if (index < 0 || !this.tabs || index >= this.tabs.length) {
      return;
    }

    this.selectedIndex = index;
    this.updateTabVisibility();
    this.tabChange.emit(index);
  }

  private updateTabVisibility(): void {
    if (!this.tabs) {
      return;
    }

    this.tabs.forEach((tab, i) => {
      tab.setShow(i === this.selectedIndex);
    });
  }
}
