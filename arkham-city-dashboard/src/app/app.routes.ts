import { Routes } from '@angular/router';
import { EmptyLayoutComponent } from '../core/layouts/empty-layout/empty-layout.component';
import { authGuard } from '../core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
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
