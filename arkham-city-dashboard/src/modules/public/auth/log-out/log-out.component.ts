import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, type OnInit } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { CapitalizePipe } from 'arkhamcity';

@Component({
  selector: 'app-log-out',
  imports: [CommonModule, TranslocoModule, CapitalizePipe],
  templateUrl: './log-out.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogOutComponent implements OnInit, OnDestroy {
  countdown = 5;
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private intervalId: any;
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.clearCountdownInterval();
  }

  private startCountdown(): void {
    this.intervalId = setInterval(() => {
      this.countdown--;
      this.cdr.markForCheck(); // Trigger change detection

      if (this.countdown <= 0) {
        this.clearCountdownInterval();
        this.authService.logOut();
        this.router.navigate(['/log-in'], {
          relativeTo: this.activatedRoute,
        });
      }
    }, 1000);
  }

  private clearCountdownInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
