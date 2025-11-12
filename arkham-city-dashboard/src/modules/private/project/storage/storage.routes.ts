import { Routes } from '@angular/router';
import { StorageComponent } from './storage.component';
import { ListComponent } from './list/list.component';
import { UploadComponent } from './upload/upload.component';

export const routes: Routes = [
  {
    path: '',
    component: StorageComponent,
    children: [
      {
        path: '',
        component: ListComponent,
        children: [
          {
            path: 'upload',
            component: UploadComponent,
          },
        ],
      },
    ],
  },
];
