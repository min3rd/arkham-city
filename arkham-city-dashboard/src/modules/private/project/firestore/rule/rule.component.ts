import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { CapitalizePipe } from '../../../../../core/pipe/capitalize.pipe';
import { ArkButton } from '../../../../../core/components/buttons/ark-button/ark-button.component';

@Component({
  selector: 'projects-firestore-rules',
  imports: [CommonModule, RouterModule, TranslocoModule, CapitalizePipe, ArkButton],
  templateUrl: './rule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RuleComponent {

}
