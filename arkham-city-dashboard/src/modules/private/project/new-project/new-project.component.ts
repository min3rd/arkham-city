import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '../../../../core/components/base/base.component';

@Component({
  selector: 'app-new-project',
  imports: [],
  templateUrl: './new-project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewProjectComponent extends BaseComponent {}
