
import { Component, OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { featherMoon, featherSun } from '@ng-icons/feather-icons';

@Component({
  selector: 'ark-switch-theme',
  imports: [NgIcon],
  templateUrl: './ark-switch-theme.component.html',
  providers: [provideIcons({ featherSun, featherMoon })],
})
export class ArkSwitchTheme implements OnInit {

  get isDarkMode() {
    return localStorage.getItem('theme') === 'dark';
  }

  ngOnInit() {
    if (!localStorage.getItem('theme')) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    }
    document.documentElement.classList.toggle(
      'dark',
      localStorage.getItem('theme') === 'dark',
    );
  }

  toggle() {
    if (this.isDarkMode) {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  }
}
