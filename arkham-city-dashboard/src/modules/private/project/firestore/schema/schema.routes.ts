import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { SchemaComponent } from './schema.component';
import { inject } from '@angular/core';
import { SchemaService } from './schema.service';
import { RouteUtils } from '@core/utils/route.utils';
import { ListComponent } from './list/list.component';
import { RecordComponent } from './record/record.component';

export const schemaListResolve = (router: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const service = inject(SchemaService);
  return service.querySchemas(
    RouteUtils.getParam('projectId', router),
    {
      query: RouteUtils.getParam('query', router) != 'all' ?
        { 'rawName': RouteUtils.getParam('query', router) }
        : {},
      page: RouteUtils.getParam('page', router),
      size: RouteUtils.getParam('size', router),
    });
};

export const recordListResolve = (router: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const service = inject(SchemaService);
  return service.queryRecords(
    RouteUtils.getParam('projectId', router),
    RouteUtils.getParam('schema', router),
    {
      query: RouteUtils.getParam('recordQuery', router) != 'all' ?
        { 'rawName': RouteUtils.getParam('recordQuery', router) }
        : {},
      page: RouteUtils.getParam('recordPage', router),
      size: RouteUtils.getParam('recordSize', router),
    });
};

export const routes: Routes = [
  {
    path: '',
    component: SchemaComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all',
      },
      {
        path: ':query',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: '1/10',
          },
          {
            path: ':page/:size',
            resolve: [schemaListResolve],
            component: ListComponent,
            children: [
              {
                path: ':schema',
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'all/1/10',
                  },
                  {
                    path: ':recordQuery',
                    children: [
                      { path: '', pathMatch: 'full', redirectTo: '1/10' },
                      {
                        path: ':recordPage/:recordSize',
                        resolve: [recordListResolve],
                        component: RecordComponent,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
