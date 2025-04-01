import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArkButton } from '../../../../core/components/buttons/ark-button/ark-button.component';
import { TranslocoModule } from '@jsverse/transloco';
import { CapitalizePipe } from '../../../../core/pipe/capitalize.pipe';

@Component({
  selector: 'app-app',
  imports: [
    CommonModule,
    RouterModule,
    ArkButton,
    TranslocoModule,
    CapitalizePipe,
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
