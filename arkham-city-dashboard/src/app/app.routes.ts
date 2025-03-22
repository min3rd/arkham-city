import { Routes } from '@angular/router';
import { EmptyLayoutComponent } from '../core/layouts/empty-layout/empty-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: EmptyLayoutComponent,
    loadChildren: () =>
      import('../modules/public/auth/auth.route').then((r) => r.routes),
  },
];
