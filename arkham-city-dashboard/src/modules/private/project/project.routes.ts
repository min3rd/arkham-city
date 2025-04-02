import { Routes } from '@angular/router';
import { ProjectComponent } from './project.component';
import { NewProjectComponent } from './new-project/new-project.component';

export const routes: Routes = [
  {
    path: ':projectId',
    component: ProjectComponent,
    children: [
      {
        path: 'new-project',
        component: NewProjectComponent,
      },
      {
        path: 'apps',
        loadChildren: () => import('./app/app.routes').then((r) => r.routes),
      },
      {
        path: 'firestore',
        loadChildren: () =>
          import('./firestore/firestore.routes').then((r) => r.routes),
      },
    ],
  },
];
