import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ArkDrawerContainer,
} from '../../../../../../core/components/drawers/ark-drawer-container/ark-drawer-container.component';
import { ArkDrawer } from '../../../../../../core/components/drawers/ark-drawer/ark-drawer.component';
import {
  ArkDrawerContent,
} from '../../../../../../core/components/drawers/ark-drawer-content/ark-drawer-content.component';
import { ArkTextInput } from '../../../../../../core/components/inputs/ark-text-input/ark-text-input.component';

@Component({
  selector: 'project-firestore-schema-list',
  imports: [CommonModule, RouterModule, ArkDrawerContainer, ArkDrawer, ArkDrawerContent, ArkTextInput],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent {

}
