import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnInit,
} from '@angular/core';
import { AuthService } from '../../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-out',
  imports: [],
  templateUrl: './log-out.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogOutComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  ngOnInit(): void {
    setTimeout(() => {
      this.authService.logOut();
      this.router.navigate(['/log-in']);
    }, 5000);
  }
}
