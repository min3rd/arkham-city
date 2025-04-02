import { ActivatedRouteSnapshot } from '@angular/router';

export class RouteUtils {
  public static getParam(key: string, route: ActivatedRouteSnapshot) {
    let tmp: any = route;
    while (!tmp.paramMap.get(key)) {
      tmp = tmp.parent;
      if (!tmp) {
        break;
      }
    }
    return tmp.paramMap.get(key);
  }
}
