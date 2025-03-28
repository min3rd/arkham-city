import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _show$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _urlMap: Map<string, boolean> = new Map<string, boolean>();
  constructor() {}

  get show$(): Observable<boolean> {
    return this._show$.asObservable();
  }

  setLoadingStatus(url: string, status: boolean) {
    if (!url) {
      return;
    }

    if (status === true) {
      this._urlMap.set(url, status);
      this._show$.next(true);
    } else if (status === false && this._urlMap.has(url)) {
      this._urlMap.delete(url);
    }

    if (this._urlMap.size === 0) {
      this._show$.next(false);
    }
  }
}
