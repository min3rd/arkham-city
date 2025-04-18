import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import {
  ArkDrawerContainer,
} from '../../../../../../core/components/drawers/ark-drawer-container/ark-drawer-container.component';
import {
  ArkDrawerContent,
} from '../../../../../../core/components/drawers/ark-drawer-content/ark-drawer-content.component';
import { ArkDrawer } from '../../../../../../core/components/drawers/ark-drawer/ark-drawer.component';

@Component({
  selector: 'project-firestore-rule-list',
  imports: [CommonModule, RouterModule, TranslocoModule, ArkDrawerContainer, ArkDrawerContent, ArkDrawer],
  templateUrl: './list.component.html',
})
export class ListComponent {

}
