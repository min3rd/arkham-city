import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'log-in',
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'log-in',
        component: LoginComponent,
      },
    ],
  },
];
