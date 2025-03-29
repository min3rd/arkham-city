import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnInit,
} from '@angular/core';
import { ArkButton } from '../../../core/components/buttons/ark-button/ark-button.component';
import { ConfigService } from '../../../core/services/config.service';
import { ArkTextarea } from '../../../core/components/textareas/ark-textarea/ark-textarea.component';
import { BaseComponent } from '../../../core/components/base/base.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ArkButton, ArkTextarea],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent extends BaseComponent {
  private httpClient: HttpClient = inject(HttpClient);
  private configService: ConfigService = inject(ConfigService);
  test() {
    this.httpClient.get(this.configService.endpoint('/test')).subscribe();
  }
}
