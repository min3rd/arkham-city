import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import * as featherIcons from '@ng-icons/feather-icons';
import { ArkNavigationBasicItem } from '../basic-item/basic-item.component';
import { NavigationItem } from '../navigation.type';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'ark-navigation-group-item',
  imports: [
    CommonModule,
    TranslocoModule,
    NgIcon,
    ArkNavigationBasicItem,
    forwardRef(() => ArkNavigationGroupItem),
  ],
  templateUrl: './group-item.component.html',
  providers: [provideIcons({ ...featherIcons })],
})
export class ArkNavigationGroupItem {
  @Input() navigation!: NavigationItem;

  expanded = false;

  toggleChildren(event: Event): void {
    // Prevent the event from bubbling up
    event.preventDefault();
    event.stopPropagation();

    // Toggle the expanded state
    this.expanded = !this.expanded;

    // Get the collapse element
    const button = event.currentTarget as HTMLElement;
    const li = button.closest('li');
    if (!li) return;

    const collapseId = `${this.navigation.id}-collapse-1`;
    const collapseElement = document.getElementById(collapseId);

    if (!collapseElement) return;

    // Toggle the hidden class
    collapseElement.classList.toggle('hidden');

    // Toggle the arrow icons
    const upArrow = button.querySelector('svg:first-of-type');
    const downArrow = button.querySelector('svg:last-of-type');

    if (upArrow && downArrow) {
      upArrow.classList.toggle('hidden');
      upArrow.classList.toggle('block');
      downArrow.classList.toggle('hidden');
      downArrow.classList.toggle('block');
    }
  }
}
