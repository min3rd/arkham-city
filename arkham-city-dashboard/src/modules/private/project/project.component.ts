import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '../../../core/components/base/base.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project',
  imports: [CommonModule, RouterModule],
  templateUrl: './project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent extends BaseComponent {}
