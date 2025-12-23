import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  ArkButton,
} from '../../../../../projects/arkhamcity/src/lib/components/buttons/ark-button/ark-button.component';
import { TranslocoModule } from '@jsverse/transloco';
import { CapitalizePipe } from '../../../../../projects/arkhamcity/src/lib/pipes/capitalize.pipe';

@Component({
  selector: 'project-firestore',
  imports: [
    RouterModule,
    TranslocoModule,
    CapitalizePipe,
    ArkButton
],
  templateUrl: './firestore.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirestoreComponent {
}
