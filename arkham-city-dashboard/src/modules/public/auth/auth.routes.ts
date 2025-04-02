import { Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { AuthComponent } from './auth.component';
import { RegisterComponent } from './register/register.component';

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
        component: LogInComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
];
