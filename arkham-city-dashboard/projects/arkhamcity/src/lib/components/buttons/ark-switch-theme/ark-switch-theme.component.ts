
import { Component, OnInit, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { featherMoon, featherSun } from '@ng-icons/feather-icons';
import { ThemeService } from '../../../services/theme/theme.service';

@Component({
  selector: 'ark-switch-theme',
  imports: [NgIcon],
  templateUrl: './ark-switch-theme.component.html',
  providers: [provideIcons({ featherSun, featherMoon })],
})
export class ArkSwitchTheme implements OnInit {

  get isDarkMode() {
    return this.themeService.currentTheme === 'dark';
  }

  private themeService = inject(ThemeService);

  ngOnInit() {
    this.themeService.initTheme();
  }

  toggle() {
    this.themeService.toggleTheme();
  }
}
