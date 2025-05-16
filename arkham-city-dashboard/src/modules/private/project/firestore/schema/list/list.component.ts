import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArkDrawer, ArkDrawerContainer, ArkDrawerContent, ArkTextInput } from 'arkhamcity';


@Component({
  selector: 'project-firestore-schema-list',
  imports: [CommonModule, RouterModule, ArkDrawerContainer, ArkDrawer, ArkDrawerContent, ArkTextInput],
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class ListComponent {
  @ViewChild('drawer') drawer!: ArkDrawer;
}
