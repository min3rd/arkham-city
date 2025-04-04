import { AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios';
import { from, Observable } from 'rxjs';

export default class HttpClient {
  private _config!: AxiosRequestConfig;
  private axios!: AxiosStatic;
  set config(config: AxiosRequestConfig) {
    this._config = config;
  }
  get<T>(url: string): Observable<AxiosResponse<T | any>> {
    return from(this.axios.get(url, this._config));
  }
  post<T, K>(url: string, data: K): Observable<AxiosResponse<T | any>> {
    return from(this.axios.post(url, data, this.config));
  }
  put<T, K>(url: string, data: K): Observable<AxiosResponse<T | any>> {
    return from(this.axios.put(url, data, this.config));
  }
  patch<T, K>(url: string, data: K): Observable<AxiosResponse<T | any>> {
    return from(this.axios.patch(url, data, this.config));
  }
  delete<T>(url: string): Observable<AxiosResponse<T | any>> {
    return from(this.axios.delete(url, this.config));
  }
}
