import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'project-storage',
  imports: [CommonModule, RouterModule, ListComponent],
  template: '<project-storage-list></project-storage-list>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class StorageComponent {}
