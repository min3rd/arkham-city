import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-app',
  imports: [],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent { }
