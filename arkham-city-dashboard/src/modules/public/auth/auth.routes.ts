import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'log-in',
  },
  {
    path: 'log-in',
    component: LoginComponent,
  },
];
