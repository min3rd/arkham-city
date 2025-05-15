import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArkButton, ArkDrawer, ArkDrawerContainer, ArkDrawerContent, ArkTextInput } from 'arkhamcity';


@Component({
  selector: 'project-firestore-schema-list',
  imports: [CommonModule, RouterModule, ArkDrawerContainer, ArkDrawer, ArkDrawerContent, ArkTextInput, ArkButton],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent {
  @ViewChild('drawer') drawer!: ArkDrawer;

  toggleDrawer() {
    this.drawer.toggle();
  }
}
