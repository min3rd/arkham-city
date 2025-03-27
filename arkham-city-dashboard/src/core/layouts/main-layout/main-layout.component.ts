import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArkSwitchTheme } from '../../components/buttons/ark-switch-theme/ark-switch-theme.component';

@Component({
  selector: 'main-layout',
  imports: [CommonModule, RouterModule, ArkSwitchTheme],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  ngOnInit(): void {}
}
