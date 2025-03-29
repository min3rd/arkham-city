import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/components/base/base.component';

@Component({
  selector: 'app-project',
  imports: [],
  templateUrl: './project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent extends BaseComponent {}
