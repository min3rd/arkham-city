import { Routes } from '@angular/router';
import { EmptyLayoutComponent } from '../core/layouts/empty-layout/empty-layout.component';
import { authGuard } from '../core/auth/guards/auth.guard';
import { noAuthGuard } from '../core/auth/guards/no-auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: '',
    canActivateChild: [noAuthGuard],
    component: EmptyLayoutComponent,
    loadChildren: () =>
      import('../modules/public/public.routes').then((r) => r.routes),
  },
  {
    path: '',
    canActivateChild: [authGuard],
    loadChildren: () =>
      import('../modules/private/private.routes').then((r) => r.routes),
  },
];
