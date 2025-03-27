import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FirestoreComponent } from './firestore/firestore.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'firestore',
    component: FirestoreComponent,
  },
];
