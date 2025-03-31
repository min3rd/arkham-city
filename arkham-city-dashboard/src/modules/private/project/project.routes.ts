import { Routes } from '@angular/router';
import { ProjectComponent } from './project.component';
import { NewProjectComponent } from './new-project/new-project.component';

export const routes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    children: [
      {
        path: 'new-project',
        component: NewProjectComponent,
      },
    ],
  },
];
