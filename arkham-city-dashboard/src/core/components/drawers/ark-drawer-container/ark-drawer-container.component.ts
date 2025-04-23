import { CommonModule } from '@angular/common';
import { Component, ContentChild, QueryList, ViewChildren } from '@angular/core';
import { ArkDrawerContent } from '../ark-drawer-content/ark-drawer-content.component';
import { ArkDrawer } from '../ark-drawer/ark-drawer.component';

@Component({
  selector: 'ark-drawer-container',
  exportAs: 'arkDrawerContainer',
  imports: [CommonModule, ArkDrawerContent],
  templateUrl: './ark-drawer-container.component.html',
})
export class ArkDrawerContainer {
  @ContentChild(ArkDrawer, {
    descendants: true,
  })
  _allDrawers!: QueryList<ArkDrawer>;
  @ContentChild(ArkDrawerContent) _content!: ArkDrawerContent;
  @ViewChildren(ArkDrawerContent) _userContent!: ArkDrawerContent;
}
