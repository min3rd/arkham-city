import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ArkProgressBar } from 'arkhamcity';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ArkProgressBar],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class DashboardComponent {

}
