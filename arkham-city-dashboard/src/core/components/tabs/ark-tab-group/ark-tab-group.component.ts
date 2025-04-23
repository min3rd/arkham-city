import { AfterContentInit, Component, ContentChildren, Input, QueryList } from '@angular/core';
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
})
export class ArkTabGroup extends BaseComponent implements AfterContentInit {
  @Input() titles!: ArkTabTitle[];
  @ContentChildren(ArkTabContent) tabs!: QueryList<ArkTabContent>;
  selectedIndex = 0;

  ngAfterContentInit() {
    this.change(this.selectedIndex);
  }

  change(index: number) {
    this.selectedIndex = index;
    this.tabs.forEach(e => e.setShow(false));
    this.tabs.get(index)?.setShow(true);
  }
}
