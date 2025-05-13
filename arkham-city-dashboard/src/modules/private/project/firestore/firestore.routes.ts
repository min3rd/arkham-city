import { Routes } from '@angular/router';
import { FirestoreComponent } from './firestore.component';

export const routes: Routes = [
  {
    path: '',
    component: FirestoreComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'schemas',
      },
      {
        path: 'schemas',
        loadChildren: () => import('./schema/schema.routes').then(s => s.routes),
      },
      {
        path: 'rules',
        loadChildren: () => import('./rule/rule.routes').then(r => r.routes),
      },
    ],
  },
];
