import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArkIcon } from '../../icons/ark-icon/ark-icon.component';
import { FormControlElement } from '../../base/form-control-element/form-control-element.component';
import { ArkTabContent } from '../ark-tab-content/ark-tab-content.component';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ArkTabGroup extends FormControlElement {
  @Input() titles!: ArkTabTitle[];
  @ContentChildren(ArkTabContent) tabs!: QueryList<ArkTabContent>;
  selectedIndex = 0;

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.change(this.selectedIndex);
  }

  change(index: number) {
    this.selectedIndex = index;
    this.tabs.forEach(e => e.setShow(false));
    this.tabs.get(index)?.setShow(true);
  }
}
