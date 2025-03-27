import { Routes } from '@angular/router';
import { EmptyLayoutComponent } from '../core/layouts/empty-layout/empty-layout.component';
import { authGuard } from '../core/auth/guards/auth.guard';
import { noAuthGuard } from '../core/auth/guards/no-auth.guard';
import { MainLayoutComponent } from '../core/layouts/main-layout/main-layout.component';

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
    component: MainLayoutComponent,
    loadChildren: () =>
      import('../modules/private/private.routes').then((r) => r.routes),
  },
];
