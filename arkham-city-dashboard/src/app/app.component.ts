import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  router: Router = inject(Router);
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
          this.changeDetectorRef.markForCheck();
        }, 100);
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          // dark mode
          if (!localStorage.getItem('hs_theme')) {
            localStorage.setItem('hs_theme', 'dark');
          }
        } else {
          if (!localStorage.getItem('hs_theme')) {
            localStorage.setItem('hs_theme', 'light');
          }
        }
      }
    });
  }
}
