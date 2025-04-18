import { Routes } from '@angular/router';
import { FirestoreComponent } from './firestore.component';

export const routes: Routes = [
  {
    path: '',
    component: FirestoreComponent,
    children: [
      {
        path: 'rule',
        loadChildren: () => import('./rule/rule.routes').then(r => r.routes),
      },
    ],
  },
];
