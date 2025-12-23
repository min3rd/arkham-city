
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { ArkButton, CapitalizePipe } from 'arkhamcity';

@Component({
  selector: 'project-app',
  imports: [
    RouterModule,
    TranslocoModule,
    CapitalizePipe,
    ArkButton
],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
}
