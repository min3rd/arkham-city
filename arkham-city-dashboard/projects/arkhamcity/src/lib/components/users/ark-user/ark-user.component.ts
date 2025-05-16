import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../base/base/base.component';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'ark-user',
  imports: [CommonModule, TranslocoModule, RouterModule, NgIcon],
  templateUrl: './ark-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArkUser extends BaseComponent {
  @Input() user!: any | null | undefined;
  isDropdownOpen = false;

  constructor(private elementRef: ElementRef) {
    super();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('keydown.escape')
  onEscapeKey(): void {
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Only close if the click is outside the component
    const clickedInside = this.elementRef.nativeElement.contains(event.target as Node);
    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }
}
