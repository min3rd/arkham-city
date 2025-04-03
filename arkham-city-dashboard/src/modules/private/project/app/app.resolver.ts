import { inject } from '@angular/core';
import type {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { AppService } from './app.service';
import { ApiResponse } from '../../../../core/type/response.type';
import { AppResDto } from './app.type';
import { RouteUtils } from '../../../../core/utils/route.utils';
import { DetailComponent } from './detail/detail.component';

export const appListResolver: ResolveFn<ApiResponse<AppResDto[]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(AppService).all(
    RouteUtils.getParam('projectId', route) as string,
  );
};

export const appDetailResolver: ResolveFn<ApiResponse<AppResDto>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(AppService).get(
    RouteUtils.getParam('projectId', route) as string,
    RouteUtils.getParam('appId', route) as string,
  );
};

export const canDeactiveDetail = (
  component: DetailComponent,
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  next: RouterStateSnapshot,
) => {
  component.closeDrawer();
  return true;
};

export const newAppResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  inject(AppService).new();
  return true;
};
