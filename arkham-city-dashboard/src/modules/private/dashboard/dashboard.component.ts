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

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ArkButton],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private httpClient: HttpClient = inject(HttpClient);
  private configService: ConfigService = inject(ConfigService);
  ngOnInit(): void {}
  test() {
    this.httpClient.get(this.configService.endpoint('/test')).subscribe();
  }
}
