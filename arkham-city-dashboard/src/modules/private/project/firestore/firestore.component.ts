import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArkButton } from '../../../../core/components/buttons/ark-button/ark-button.component';
import { TranslocoModule } from '@jsverse/transloco';
import { CapitalizePipe } from '../../../../core/pipe/capitalize.pipe';

@Component({
  selector: 'project-firestore',
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    CapitalizePipe,
    ArkButton,
  ],
  templateUrl: './firestore.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirestoreComponent {
}
